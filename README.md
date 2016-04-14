Switch
=========
[![Build Status](https://travis-ci.org/luke-j/switch.svg?branch=master)](https://travis-ci.org/luke-j/switch)
[![Test Coverage](https://codeclimate.com/github/luke-j/switch/badges/coverage.svg)](https://codeclimate.com/github/luke-j/switch/coverage)

Switch is a language agnostic CLI that allows you to write apache or nginx conf as JSON and switch between the two seamlessly.

Installation
---------
**Install the SpiderMonkey javascript shell:**

Linux:
```bash
apt-get install -y libmozjs-24-bin
```

Mac with homebrew:
```bash
brew install spidermonkey
```

**Download Switch:**
```bash
curl -o- https://raw.githubusercontent.com/luke-j/switch/master/install.sh | bash
```

**Create your ``.switchrc`` config file** (see the example [here]()).

Usage
---------
Once you've created your config file, you can create conf and switch server software via the CLI:
```
Switch

Note: currently supported <app> options are either nginx or apache

Usage:
  switch help                   Show this message
  switch to <app>               Build conf file for the <app> specified and start the <app> service, cathing any <app> errors
    --config <file>             Config file to used to generate conf file. Default: <current directory>/.switchrc
    --out <file>                Output file. Default: /etc/nginx/sites-enabled/switch.conf, /etc/apache2/sites-enabled/switch.conf
    --source <file>             The Switch source directory, for current directory, use a period. Default: ~/.switch
    --print                     Display the generated conf without writing to the output file
  switch current                Display <app> currently being used

Example:
  switch use nginx              Generate nginx.conf and start the nginx service
  switch use apache --print     Display the generated apache.conf, without writing to file or starting apache
```

``.switchrc`` files
---------
``.switchrc`` files are just json. Config options are given under a property with the same name as the server.

For example, if we wanted to create a virtual host for ``example.com``, our ``.switchrc`` file would read:
```json
{
    "example.com": {

    }
}
```

In addition to these options, you can also include "locations" - which are any properties starting with a forward slash. Locations allow you to nest options for particular URL paths.

For example, if we wanted to compress javascript assets under the url ``example.com/static/js``, we could do:
```json
{
    "example.com": {
        "/static/js": {
            "compress": {
                "enable": true,
                "types": [
                    "application/javascript"
                ]
            }
        }
    }
}
```

Config Options
---------
##### port
Type: ``Number``, Default: ``80``, **Required**

##### aliases
Type: ``Array``, Default: ``[]``

##### accessLog
Type: ``String``, Default: ``null``

##### errorLog
Type: ``String``, Default: ``null``

##### root
Type:  ``String``, Default:  ``null``

##### index
Type:  ``Array``, Default:  ``null``

##### fastcgi
Type:  ``Boolean``, Default:  ``false``

##### serverSignature
Type:  ``Boolean``, Default:  ``true``

##### listDirectories
Type:  ``Boolean``, Default:  ``false``

### ssl
Type:  ``Object``, Default:  ``Object``

##### ssl.enable
Type:  ``Boolean``, Default:  ``false``

##### ssl.cert
Type:  ``String``, Default:  ``null``

##### ssl.key
Type:  ``String``, Default:  ``null``

### compress
Type:  ``Object``, Default:  ``Object``

##### compress.enable
Type:  ``Boolean``, Default:  ``true``

##### compress.types
Type:  ``Array``, Default:  ``['text/plain']``

### caching
Type:  ``Object``, Default:  ``Object``

##### caching.enable
Type:  ``Boolean``, Default:  ``false``

##### caching.types
Type:  ``Array``, Default:  ``['text/plain']``

##### caching.expires
Type:  ``Object``, Default:  ``Object``

##### caching.expires.years
Type:  ``Number``, Default:  ``0``

##### caching.expires.months
Type:  ``Number``, Default:  ``0``

##### caching.expires.weeks
Type:  ``Number``, Default:  ``0``

##### caching.expires.days
Type:  ``Number``, Default:  ``0``

##### caching.expires.minutes
Type:  ``Number``, Default:  ``0``

### auth
Type:  ``Object``, Default:  ``Object``

##### auth.enable
Type:  ``Boolean``, Default:  ``false``

##### auth.message
Type:  ``String``, Default:  ``'Restricted'``

##### auth.userFile
Type:  ``String``, Default:  ``null``

### headers
Type:  ``Object``, Default:  ``Object``

##### headers.set
Type:  ``Object``, Default:  ``null``

##### headers.unset
Type:  ``Array``, Default:  ``[]``

### proxy
Type:  ``Object``, Default:  ``Object``

##### proxy.enable
Type:  ``Boolean``, Default:  ``false``

##### proxy.to
Type:  ``String``, Default:  ``null``

### redirect
Type:  ``Object``, Default:  ``Object``

##### redirect.enable
Type:  ``Boolean``, Default:  ``false``

##### redirect.to
Type:  ``String``, Default:  ``null``

##### redirect.permanent
Type:  ``Boolean``, Default:  ``true``

Example ``.switchrc`` file
---------
This example creates an SSL virtual host for ``example.com`` with a reverse proxy on port 3000, it caches and compresses static assets, and performs a 301 redirect on ``http://`` and ``www`` subdomain traffic to ``https://example.com``.

```json
{
	"example.com": {
		"port": 443,
		"ssl": {
			"enable": true,
			"cert": "/etc/ssl/cert.crt",
			"key": "/etc/ssl/cert.key"
		},
		"aliases": ["sub.example.com"],
		"accessLog": "/var/log/access.log",
		"errorLog": "/var/log/error.log",
		"root": "/var/www",
		"index": [
			"index.js"
		],
		"serverSignature": false,
		"listDirectories": false,
		"/": {
		    "proxy": {
        		"enable": true,
        		"to": "http://localhost:3000"
        	}
		},
		"/static": {
			"compress": {
				"enable": true,
				"types": [
					"text/plain",
					"application/javascript",
					"text/javascript",
					"text/css"
				]
			},
			"caching": {
				"enable": true,
				"types": [
					"js", "css", "html", "svg"
				],
				"expires": {
					"years": 1
				}
			},
			"headers": {
				"set": {
					"header-1": "1",
					"header-2": "2",
					"header-3": "3"
				},
				"unset": [
					"bad-header-1",
					"bad-header-2"
				]
			}
		}
	},
	"www.example.com": {
		"port": 80,
		"aliases": ["example.com"],
		"redirect": {
			"enable": true,
			"to": "https://example.com",
			"permanent": true
		}
	}
}
```

Issues
---------
If you have any problems, post an issue to this repository's issue page.

Contributing
---------
Fork and clone the repository and run the following:
```bash
npm install && npm run watch
```
Once you've made your changes, run the build process:
```bash
npm run build
```
Finally, if your tests pass, submit a pull request!

You can also run ``vagrant up`` for a simple development box with node, nginx and apache installed.

License
---------
Copyright 2016- Luke Jones (https://github.com/luke-j)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.