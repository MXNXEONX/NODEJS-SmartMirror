/** sample code for using snowboy library **/
/** @bugsounet **/
/** Warning : This sample is not up to date ! **/
/** I will update it in next Release **/

const Snowboy = require("./index.js").Snowboy

// with npm library:
// const Snowboy = require("@bugsounet/snowboy").Snowboy

var config = {
  debug: true,
  snowboy: {
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
