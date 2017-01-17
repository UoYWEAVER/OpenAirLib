#!/bin/bash

FFMPATH=/Users/kennethbrown/Desktop/Local/360AVCap/FFMpeg
IPPATH=/Users/kennethbrown/Desktop/Local/360AVCap/YTR160824/CAMS/as161004/xfer

VFILE1=$IPPATH/asT1C0.kava.amb.mp4
VFILE2=$IPPATH/asT2C0.kava.amb.mp4
VFILE3=$IPPATH/asT3C0.kava.amb.mp4
VFILE4=$IPPATH/asT4C0.kava.amb.mp4

START1=0:5:32.000
START2=0:6:02.000
START3=0:5:45.000
START4=0:6:17.000

# could use -to ENDX instead of -t DURX if got recent ffmpeg
END1=0:7:50.000
END2=0:8:20.000
END3=0:8:03.000
END4=0:8:29.000

# calcd durs (after adj times to make as consistent as poss)
# 1 2:18
# 2 2:18
# 3 2:18
# 4 2:12 faster & ends so cant extend end silence!

APPXDURATION=0:2:18.000

OPVFILE1=ytr_sherlock_S1b_UC.mp4
OPVFILE2=ytr_sherlock_S1b_G.mp4
OPVFILE3=ytr_sherlock_S1b_S.mp4
OPVFILE4=ytr_sherlock_S1b_DC.mp4

# ffmpeg -ss [start] -i in.mp4 -t [duration] -c copy out.mp4 
$FFMPATH/ffmpeg -ss $START1 -i $VFILE1 -t $APPXDURATION -c copy $OPVFILE1
$FFMPATH/ffmpeg -ss $START2 -i $VFILE2 -t $APPXDURATION -c copy $OPVFILE2
$FFMPATH/ffmpeg -ss $START3 -i $VFILE3 -t $APPXDURATION -c copy $OPVFILE3
$FFMPATH/ffmpeg -ss $START4 -i $VFILE4 -t $APPXDURATION -c copy $OPVFILE4


# NOTES alt-cmd-K clear scrollback

