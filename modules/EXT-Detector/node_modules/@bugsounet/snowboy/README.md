# snowboy

[snowboy](https://github.com/Kitt-AI/snowboy) project will to shut down ... in Dec. 31st, 2020.

So i will try to maintened it ;)

I will **ONLY** maintened JS code for node use for continue to use snowboy as detector for home assistant or other. (exemple for MagicMirror Project)
I have decoded other version of snowboy

I will start this new versioning at v1.4.0 (same as v1.3.1 in Kitt-AI repository)

## Update

 * **V2.2.0** (21/10/02)
   * update all package dependencies
   * correct warning with snowboy.cc

 * **v2.0.0** (20/01/17)
   * add multi-keyword search (V2)
   * @todo: making new sample for v2

 * **v1.6.3** (20/09/26)
   * remove Global notice

 * **v1.6.0 -> 1.6.2** (20/08/23)
   * add PMDL support (personal keyword)
   * add GLOBAL notice for @ktoanlba89 **copying my MagicMirror modules don't pay !**

 * **v1.5.1** (20/08/12)
   * prevent too much listening time (restarting automaticaly)

 * **v1.5.0** (20/05/31)
   * Update library

 * **v1.4.6-v1.4.7** (20/05/06)
   * installer review
   * use @bugousnet/lpcm16 library

 * **v1.4.5** (20/05/02)
   * add log on start

 * **v1.4.4** (20/04/22)
   * writing help and sample
   
 * **v1.4.3** (20/04/21)
   * prepare npm library
   * create new Snowboy library
   * create sample
   * update package.json
   
 * **v1.4.2** (20/04/19)
   * internal test for npm install
   
 * **v1.4.1** (20/04/10)
   * Cleaning: now *ONLY* for Node version
   * update library database
   * compilation error solved
   * npm install complete without error
   * added `Alexa` keyword in database
   
 * **V1.4.0**
   * initial version of Kitt-AI@snowboy

## Dependencies

 For listening keyword, you have to use a mic, so `snowboy` need some dependencies to use it

```sh
sudo apt install libmagic-dev libatlas-base-dev sox libsox-fmt-all build-essential
```

## Installation

```sh
npm install @bugsounet/snowboy
```

## Sample with new Snowboy contructor

```js
/** sample code for using snowboy library **/
/** @bugsounet **/

const Snowboy = require("@bugsounet/snowboy").Snowboy

var config = {
  debug: true,
  snowboy: {
    usePMDL: false,
    PMDLPath: "./",
    audioGain: 2.0,
    Frontend: true,
    Model: "jarvis",
    Sensitivity: null
  },
  micConfig: {
    recorder: "arecord",
    device: "plughw:1",
  },
}

this.snowboy = new Snowboy(config.snowboy, config.micConfig, (detected) => { detect(detected) }, config.debug )
this.snowboy.init()
this.snowboy.start()

function detect(detected) {
  console.log("Make your script if " + detected + " is detected")
}
```

## constructor of Snowboy

Snowboy(snowboyConfig, micConfig, callback, debug)

### SnowboyConfig

- `AudioGain` - set the gain of mic. Usually you don't need to set or adjust this value.

- `Frontend` -  set pre-processing of hotword detection. When you use only snowboy and smart_mirror, false is better. But with other models, true is better to recognize.

- `Model` - set the name of your detector. Available: "smart_mirror", "jarvis", "computer", "snowboy", "subex", "neo_ya", "hey_extreme", "view_glass"

- `Sensitivity` - Override default sensitivity value for applied model defined in `Model`.
    * Value could be within a range from `0.0` to `1.0`.
    * Default sensitivity values for preconfigured models are:
      * smart_mirror: `0.5`
      * jarvis: `0.7`
      * computer: `0.6`
      * snowboy: `0.5`
      * subex: `0.6`
      * neo_ya: `0.7`
      * hey_extreme: `0.6`
      * view_glass: `0.7`

    * `null` will set default sensitivity.

- `usePMDL` - If you want to use a personal keyword enable it
    * Notes:
      * You have to set your personnal model name in the `Model` part without `.pmdl` extension.
      * Default `Sensitivity` is set to `0.5` by default

- `PMDLPath` - path of your personal keyword

### micConfig
- `recorder` - record program, `rec`, `arecord`, `sox`, `parec` is available.
    * On RaspberryPi or some linux machines, `arecord` is better.
    * On OSX, `rec` is better.
    * If you prefer to use `pulse audio`, `parec` would be available also.

- `device` - recording device (microphone) name of your environment. (e.g. "plughw:1")
    * Find proper device name by yourself. (arecord -l will be help on Raspberry Pi or linux platform)

### callback

if snowboy detect a keyword, it return it with his name

### debug

if you want debuging information, just set to `true`

## Functions
 * `init()` : initialize the constructor
 * `start()` : start listening and waiting for your keyword
 * `stop()` : force stop listening

## Old constructor of Kitt-AI still also available !

see [Kitt-AI@snowboy](https://github.com/Kitt-AI/snowboy) repository for manual of Models, Detector

