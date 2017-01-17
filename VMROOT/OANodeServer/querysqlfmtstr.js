'use strict';
const myexports = module.exports = {};
myexports.sql = `
--vvvvv QUERY HERE vvvvv
WITH
srclut AS (select tid, name from term_data ),
gvlut AS (select tid, name from term_data),
frpglut AS (select tid, name from term_data),
--searchmode--
searchmode AS ( select %s as value ),
-- 0=list all, 1=search title, filename & info for string, 2=filepath 3=fid
--eosearchmode--

filenodestmp AS
(
	(
	 SELECT nid,field_mono_fid AS fid, 1 as kftype -- give kftype a unique value dep on irchanpermtype
	 FROM content_field_mono
	 WHERE field_mono_fid IS NOT NULL
	)
	UNION
	(
	 SELECT nid,field_stereo_fid AS fid, 2 as kftype
	 FROM content_field_stereo
	 WHERE field_stereo_fid IS NOT NULL
	)
	UNION
	(
	 SELECT nid,field_bformat_multi_fid AS fid, 4 as kftype
	 FROM content_field_bformat_multi
	 WHERE field_bformat_multi_fid IS NOT NULL
	)
	UNION
	(
	 SELECT nid,field_surround_5_fid AS fid, 6 as kftype
	 FROM content_field_surround_5
	 WHERE field_surround_5_fid IS NOT NULL
	)
	-- also check w,wx,x,y,yz,z,hoa,surround_7,encoded_audio!!! however @ pres these are all null
	ORDER BY fid
), -- 552 rows

fileinfotmp AS
(
	SELECT
	filenodestmp.*, -- nid, fid, <dev kftype can dbl chk expected n chans etc>
	files.filename,
	node.title,
 	filefield_wav_meta.audio_sample_rate AS fs,
	filefield_wav_meta.audio_channels AS chans,
	node.uid,
	--node.type,
	files.filepath
	,srclut.name as SrcCat
	,gvlut.name as GenVal
	,frpglut.name as FrPg
	FROM filenodestmp,
	files,
	node,
	filefield_wav_meta
	,content_type_auralization
	,srclut
	,gvlut
	,frpglut
	WHERE
	true
	AND filenodestmp.nid = node.nid
	AND filenodestmp.fid = files.fid
	AND filenodestmp.fid = filefield_wav_meta.fid
	AND node.type LIKE 'auralization%%'
	AND SUBSTRING(files.filepath from 1 for 39) LIKE 'sites/default/files/auralization/data/%%'
    AND files.filemime = 'audio/x-wav'
    AND files.fid > 0
	AND node.nid = content_type_auralization.nid
	AND content_type_auralization.field_source_cat_value = srclut.tid
	AND content_type_auralization.field_generation_value = gvlut.tid
	AND content_type_auralization.field_front_page_suit_value = frpglut.tid
 	ORDER by filenodestmp.fid
), -- 367->356 rows

nodephototmp AS
(
	SELECT content_field_photo.nid, field_photo_fid as pfid, files.filepath as photopath
	FROM content_field_photo, files
	WHERE content_field_photo.delta = 0 -- first
	AND field_photo_fid > 0
	AND files.fid = field_photo_fid
	ORDER BY content_field_photo.nid
), -- 55 nodes have at least 1 photo - 55 is exactly the number of items
-- represented in the demonstration folder
-- & approx the no of impulse_data entries (58 of those in my dbcache)

nodert60tmp AS
(
	SELECT content_type_auralization.nid, impulse_data.rt60
	FROM impulse_data, content_type_auralization
	WHERE
	true
	AND content_type_auralization.field_convolve_fid = impulse_data.fid
),

fileinfotmp2 AS
(
	SELECT fileinfotmp.*, photopath
	FROM fileinfotmp LEFT OUTER JOIN nodephototmp
	ON (fileinfotmp.nid = nodephototmp.nid)
),

fileinfotmp3 AS
(
	SELECT fileinfotmp2.*, rt60
	FROM fileinfotmp2 LEFT OUTER JOIN nodert60tmp
	ON (fileinfotmp2.nid = nodert60tmp.nid)
)

,fileinfo AS
(
	SELECT fileinfotmp3.*
	FROM fileinfotmp3
	WHERE (fileinfotmp3.FrPg LIKE 'Suitable%%')
	AND ( fileinfotmp3.chans = 1 OR fileinfotmp3.chans = 2 OR fileinfotmp3.chans = 4 )
	-- reduces 218 to 208 (some were 6 chan)
	--AND ( fileinfotmp3.chans = 6 ) -- 10 were 6 chan
)

(
	SELECT
	fileinfo.fid,
	fileinfo.nid,
	fileinfo.uid,
	fileinfo.title,
 	fileinfo.filename,
	fileinfo.fs,
	fileinfo.chans
	,fileinfo.kftype -- dev
	,fileinfo.rt60 AS "rt60_1K"
	,fileinfo.SrcCat
	,fileinfo.GenVal
	,fileinfo.FrPg
	,users.init AS email
	,creativecommons_lite.license AS cc_license
	,fileinfo.filepath
	,fileinfo.photopath
	,content_field_description.field_description_value AS descn
	FROM
	  fileinfo
	  ,users
	  ,content_field_description
	  ,creativecommons_lite
	  ,searchmode
	WHERE
		true -- put this in so can comment out any line inc first w/o messing up query
		AND users.uid = fileinfo.uid
		AND content_field_description.nid = fileinfo.nid
		AND creativecommons_lite.nid = fileinfo.nid
		--searchhere--
		AND ( (searchmode.value!=1)
			OR (LOWER(content_field_description.field_description_value) LIKE LOWER('%s%%'))
		 	OR (LOWER(fileinfo.title)                                    LIKE LOWER('%s%%'))
		 	OR (LOWER(fileinfo.filename)                                 LIKE LOWER('%s%%'))
		)
		AND ( (searchmode.value!=2)
			OR (LOWER(fileinfo.filepath) LIKE LOWER('%s'))
		)
		AND ( (searchmode.value!=3)
			OR fileinfo.fid = %s
		)
		--eosearchhere--
	ORDER BY fid
	LIMIT ALL

)
-- ^^^^^ QUERY END ^^^^^^
`;
