
@chcp 936

set jsdocPath="C:\Users\Administrator\AppData\Roaming\npm\jsdoc.cmd"

call %jsdocPath% -c .\jsdoc.conf.json

copy .\out\styles\jsdoc-default.css+.\jsdoc-extra.css .\out\styles\jsdoc-default.css

pause