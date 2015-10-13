# multi-watchify
Run watchify on multiple files. Not yet stable, there will be breaking changes. Don't use this project.


## Examples
Say all your entry point files are stored in `/js/entry/` and you want to output the watchified files to `/js/bundles/`
```shell
multi-watchify -i /js/entry/ -o /js/bundles/

# add -s if you want sourcemaps
multi-watchify -i /js/entry/ -o /js/bundles/ -s
```