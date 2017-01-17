var Dolby = Dolby || {};
!function() {
    "use strict";
    Dolby.supportDDPlus = !1;
    var e = new Audio;
    "" != e.canPlayType('audio/mp4;codecs="ec-3"') &&
    ( -1 != navigator.userAgent.indexOf("Safari") &&
      -1 != navigator.userAgent.indexOf("Version/9.0") &&
      -1 != navigator.userAgent.indexOf("Mac OS X 10_11") &&
      (Dolby.supportDDPlus = !0),
       -1 != navigator.userAgent.indexOf("Edge") && (Dolby.supportDDPlus = !0)
    ),
    Dolby.checkDDPlus = function() {
        return Dolby.supportDDPlus
    }
}();
 
