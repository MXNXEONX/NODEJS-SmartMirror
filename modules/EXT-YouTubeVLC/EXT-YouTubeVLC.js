//
// Module : EXT-YouTube
// @bugsounet 02/2022

logYT = (...args) => { /* do nothing */ }

Module.register("EXT-YouTubeVLC", {
  defaults: {
    debug: false,
    useSearch: true,
    displayHeader: true,
    minVolume: 30,
    maxVolume: 100
  },

  start: function() {
    if (this.config.debug) logYT = (...args) => { console.log("[YT]", ...args) }
    this.sendSocketNotification('INIT', this.config)
    this.YT = {
      running: false
    }
    this.searchInit= false
    this.initializeVolumeVLC()
  },

  notificationReceived: function(notification, payload, sender) {
    switch (notification) {
      case "DOM_OBJECTS_CREATED":
        logYT("Go YouTube VLC!")
        break
      case "GAv4_READY":
        if (sender.name == "MMM-GoogleAssistant") this.sendNotification("EXT_HELLO", this.name)
        break
      case "EXT_YOUTUBEVLC-PLAY":
        this.Started()
        this.sendSocketNotification("YT_PLAY", payload)
        break
      case "EXT_STOP":
      case "EXT_YOUTUBEVLC-STOP":
        if (this.YT.running) this.sendSocketNotification("YT_CLOSE")
        break
      case "EXT_YOUTUBEVLC-SEARCH":
        if (!this.searchInit) {
          this.sendNotification("EXT_ALERT", {
            type: "error",
            message: this.translate("YouTubeSearchDisabled"),
            icon: "modules/EXT-YouTubeVLC/resources/YT.png"
          })
          return console.error("Search function is disabled!")
        }
        if (payload) this.sendSocketNotification("YT_SEARCH", payload)
        break
      case "EXT_YOUTUBEVLC-VOLUME_MAX":
        if (this.YT.running) this.sendSocketNotification("YT_VOLUME", this.config.maxVolume)
        break
      case "EXT_YOUTUBEVLC-VOLUME_MIN":
        if (this.YT.running) this.sendSocketNotification("YT_VOLUME", this.config.minVolume)
        break
    }
  },

  socketNotificationReceived: function(notification, payload) {
    switch (notification) {
      case "YT_SEARCH_INITIALIZED":
        this.searchInit= true
        break
      case "YT_FOUND":
        if (this.config.displayHeader) {
          this.sendNotification("EXT_ALERT", {
            type: "information",
            message: this.translate("YouTubeIsPlaying", { VALUES: payload.title }),
            icon: "modules/EXT-YouTubeVLC/resources/YT.png",
            timer: 6000,
            sound: "modules/EXT-YouTubeVLC/resources/YT-Launch.mp3"
          })
        }
        this.notificationReceived("EXT_YOUTUBEVLC-PLAY", payload.id)
        break
      case "YT_FINISH":
        this.Ended()
        break
      case "YT_TOKEN_MISSING":
        this.sendNotification("EXT_ALERT", {
          type: "error",
          message: this.translate("YouTubeTokenError"),
          icon: "modules/EXT-YouTubeVLC/resources/YT.png",
          timer: 10000,
        })
        break
      case "YT_LIBRARY_ERROR":
        this.sendNotification("EXT_ALERT", {
          type: "error",
          message: this.translate("YouTubeLibraryError", { VALUES: payload }),
          icon: "modules/EXT-YouTubeVLC/resources/YT.png",
          timer: 10000,
        })
        break
      case "YT_SEARCH_ERROR":
        this.sendNotification("EXT_ALERT", {
          type: "error",
          message: this.translate("YouTubeFoundError"),
          icon: "modules/EXT-YouTubeVLC/resources/YT.png",
          timer: 5000,
        })
        break
      case "YT_CREDENTIALS_MISSING":
        this.sendNotification("EXT_ALERT", {
          type: "error",
          message: this.translate("YouTubeCredentialsError"),
          icon: "modules/EXT-YouTubeVLC/resources/YT.png",
          timer: 10000,
        })
        break
    }
  },

  getDom: function() {
    var dom = document.createElement("div")
    dom.style.display = 'none'
    return dom
  },

  getTranslations: function() {
    return {
      en: "translations/en.json",
      fr: "translations/fr.json"
    }
  },

  Ended: function() {
    this.broadcastStatus("END")
    this.YT.running= false
    this.Showing()
  },

  Started: function() {
    this.Hiding()
    this.YT.running = true
    this.broadcastStatus("START")
  },

  Hiding: function() {
    logYT("Hiding all modules")
    MM.getModules().exceptModule(this).enumerate((module) => {
      module.hide(1000, {lockString: "EXT-YT_LOCKED"})
    })
  },

  Showing: function() {
    logYT("Showing all modules")
    MM.getModules().exceptModule(this).enumerate((module) => {
      module.show(1000, {lockString: "EXT-YT_LOCKED"})
    })
  },

  broadcastStatus: function(status) {
    if (status == "START") this.sendNotification("EXT_YOUTUBEVLC-CONNECTED")
    else if (status == "END") this.sendNotification("EXT_YOUTUBEVLC-DISCONNECTED")
  },

  /****************************/
  /*** TelegramBot Commands ***/
  /****************************/

  getCommands: function(commander) {
    commander.add({
      command: "youtube",
      description: this.translate("YouTubeDescription"),
      callback: "tbYoutube"
    })
  },

  tbYoutube: function(command, handler) {
    var query = handler.args
    if (query) {
      var args = query.toLowerCase().split(" ")
      var params = query.split(" ").slice(1).join(" ")
      switch (args[0]) {
        case "play":
          if (params) {
            params = params.split(" ")
            this.notificationReceived("EXT_YOUTUBEVLC-PLAY", params[0])
            handler.reply("TEXT", this.translate("YouTubePlay", { VALUES: params[0] }))
          } else handler.reply("TEXT", "/youtube play <video ID>")
          break
        case "stop":
          this.notificationReceived("EXT_YOUTUBEVLC-STOP")
          handler.reply("TEXT", this.translate("YouTubeStop"))
          break
        case "search":
          if (!this.config.useSearch || !this.searchInit) return handler.reply("TEXT", this.translate("YouTubeSearchDisabled"))
          if (params) {
            this.notificationReceived("EXT_YOUTUBEVLC-SEARCH", params)
            handler.reply("TEXT", this.translate("YouTubeSearch", { VALUES: params }))
          }
          else handler.reply("TEXT", "/youtube search <youtube title/artist>")
          break
        default:
          handler.reply("TEXT", this.translate("YouTubeCmdNotFound"))
          break
      }
    } else {
      handler.reply("TEXT", this.translate("YouTubeHelp") + (this.config.useSearch ? this.translate("YouTubeSearchHelp") : ""), {parse_mode:'Markdown'})
    }
  },

  /** initialise volume control for VLC **/
  initializeVolumeVLC: function() {
    /** convert volume **/
    try {
      let valueMin = null
      valueMin = parseInt(this.config.minVolume)
      if (typeof valueMin === "number" && valueMin >= 0 && valueMin <= 100) this.config.minVolume = ((valueMin * 255) / 100).toFixed(0)
      else {
        console.error("[YT] config.minVolume error! Corrected with 30")
        this.config.minVolume = 70
      }
    } catch (e) {
      console.error("[YT] config.minVolume error!", e)
      this.config.minVolume = 70
    }
    try {
      let valueMax = null
      valueMax = parseInt(this.config.maxVolume)
      if (typeof valueMax === "number" && valueMax >= 0 && valueMax <= 100) this.config.maxVolume = ((valueMax * 255) / 100).toFixed(0)
      else {
        console.error("[YT] config.maxVolume error! Corrected with 100")
        this.config.maxVolume = 255
      }
    } catch (e) {
      console.error("[YT] config.maxVolume error!", e)
      this.config.maxVolume = 255
    }
    console.log("[YT] VLC Volume Control initialized!")
  },
})
