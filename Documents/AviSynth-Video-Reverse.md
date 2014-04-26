## Video reversing with FFmpeg+AviSynth

<i>This assumes you have 32-bit FFmpeg and get 32-bit versions of everything else.</i>

---

<br />

#### First, you need to get [AviSynth](http://avisynth.nl/index.php/Main_Page).

* I recommend the latest alpha of [2.6](https://sourceforge.net/projects/avisynth2/files/AviSynth_Alpha_Releases/), as it has some useful stuff over 2.5.x
* Download and install whatever version (remember what folder you install it to)

<br />

#### Second, you need to get a plugin to load your video properly.

* [FFmpegSource2](https://github.com/FFMS/ffms2/releases), download the latest .7z release
* Copy the files ```ffms2.dll``` and ```FFMS2.avsi``` (not located in the x64 folder) into your ```C:\path\to\AviSynth\plugins``` folder

(Most other loaders don't do 10bit properly in my experience)

<br />

#### Third, write a script to reverse the video, put it in a file named ```something.avs```.
```
v = FFVideoSource("path\to\your\video.mkv")
return v.Reverse()
```

<br />

#### Finally, you simply pass ```something.avs``` into ffmpeg as the video file instead of ```video.mkv```.
The combination of reversing the video and using vp8 encoding may be slow, and there are ways to speed up the reversing process, but it's beyond the scope of this tutorial to explain how and why.

<br />

---

### Advanced

#### Seeking

If you need to cut out a segment of the video to reverse, you can do the following in the script file:
```
v = FFVideoSource("path\to\your\video.mkv")
v = v.Trim(FIRST_FRAME, LAST_FRAME)
return v.Reverse()
```
FIRST_FRAME and LAST_FRAME are exact frame numbers of the video, and both frames are <b>included</b> in the output video.

Frame numbers can be located by opening your video in MPC-HC and pressing CTRL+G at a certain time. There should be a popup box with something like:

>Frame: ```67, 23.976```

You want the first number (67 here.)

(In MPC-HC, you can use CTRL+Left/Right Arrow to seek frame-by-frame.)

<br />

#### FFVideoSource Failure

If the script fails to load your video (FFVideoSource fails somehow,) you can try a few others in place of FFVideoSource:

* ```DirectShowSource("video.mkv")``` (might not work on 10bit videos)
* ```OpenDMLSource("video.avi")``` or ```AviSource("video.avi")``` for .avi files
