function x()

clc
close all

azd = 180;
eld = 5;
rod = 0;

d2r = 2*pi/360;

cosaz = cos( azd*d2r );
sinaz = sin( azd*d2r );

cosel = cos( eld*d2r );
sinel = sin( eld*d2r );

cosro = cos( rod*d2r );
sinro = sin( rod*d2r );

% es by row as def 1e r1=012,r2=345,r3=678
e0 = (cosel * cosaz);
e1 = (cosro * sinaz) + (sinro * sinel * cosaz);
e2 = (sinro * sinaz) - (cosro * sinel * cosaz); 
e3 = (-cosel * sinaz);
e4 = (cosro * cosaz) - (sinro * sinel * sinaz); 
e5 = (sinro * cosaz) + (cosro * sinel * sinaz); 
e6 = sinel;
e7 = -sinro*cosel;
e8 = cosro*cosel;


A = ...
[ ...
e0, e1, e2 ;...
e3, e4, e5 ;...
e6, e7, e8 ;...
];

MATLABINV=true;
if MATLABINV
	A=A';
end




origin = [0,0,0];
test = [1,0,0];
rotdvec = test*A;

ox = [1,0,0];
oy = [0,1,0];
oz= [ 0,0,1];


line3d( origin, ox, 'r' );
line3d( origin, oy, 'g' );
line3d( origin, oz, 'b' );
hold all;
line3d( origin, rotdvec, 'c' );

disp('fin');

	function line3d( o1, o2, colr )
		if size(o1,1) > size(o1,2)
			o1=o1';
		end
		if size(o2,1) > size(o2,2)
			o2=o2';
		end
		tmp = [o1;o2];
		line( tmp(:,1), tmp(:,2), tmp(:,3), 'Color', colr );
	end

end % function x

