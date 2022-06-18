/** Vocal control for EXT-YouTubeVLC **/
/**  @bugsounet  **/
/** 27/02/2022 **/

var recipe = {
  transcriptionHooks: {
    "YouTube": {
      pattern: "뮤직 (.*)",
      command: "YouTube_SEARCH"
    }
  },

  commands: {
    "YouTube_SEARCH": {
      functionExec: {
        exec: (params) => {
          this.sendNotification("EXT_YOUTUBEVLC-SEARCH", params[1])
        }
      },
      soundExec: {
        chime: "open",
      },
      displayResponse: true
    }
  }
}
exports.recipe = recipe
