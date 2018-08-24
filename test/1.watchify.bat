
chcp 936

set watchifyPath="C:\Users\Administrator\AppData\Roaming\npm\watchify.cmd"

%watchifyPath%  ../nmui.js -o ./nmui.bundle.js -v ^
	-r ../nmui.js:nmui ^


pause
