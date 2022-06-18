const HTMLParser=require("node-html-parser"),path=require("path"),fs=require("fs"),Entities=require("html-entities").AllHtmlEntities,entities=new Entities;var _log=Function.prototype.bind.call(console.log,console,"[GA:SP]"),log=function(){};class SCREENPARSER{constructor(e,t){this.config=e,1==t&&(log=_log)}parse(e,t=(()=>{})){if(e.screen){var r=this.config.responseOutputURI,n=path.resolve(__dirname,"..",r);if(!e.screen.originalContent)return;var o=e.screen.originalContent.toString("utf8");o=(o=(e=>e.replace(/document\.body,"display","none"/gim,(e=>'document.body,"display","block"')))(o)).replace("html",'html style="zoom:'+this.config.responseOutputZoom+'"');var s="/modules/MMM-GoogleAssistant/"+this.config.responseOutputCSS+"?seed="+Date.now();o=o.replace(/<style>html,body[^<]+<\/style>/gim,`<link rel="stylesheet" href="${s}">`);var l=HTMLParser.parse(e.screen.originalContent),i=l.querySelector(".popout-content");e.screen.text=i?i.structuredText:null,e.text=i&&i.querySelector(".show_text_content")?i.querySelector(".show_text_content").structuredText:null,e.screen=this.parseScreenLink(e.screen),e.screen.photos=[];var c=l.querySelectorAll(".photo_tv_image");if(c)for(var a=0;a<c.length;a++)e.screen.photos.push(c[a].attributes["data-image-url"]);fs.writeFile(n,o,(o=>{o?(log("CONVERSATION:SCREENOUTPUT_CREATION_ERROR",o),t(o)):(log("CONVERSATION:SCREENOUTPUT_CREATED"),e.screen.path=n,e.screen.uri=r,t(e))}))}}parseScreenLink(e){var t=e.originalContent;e.links=[];for(var r=[/data-url=\"([^\"]+)\"/gim,/ (http[s]?\:\/\/[^ \)]+)[ ]?\)/gim,/\: (http[s]?\:\/\/[^ <]+)/gim],n=null,o=[],s=0;s<r.length;s++)for(var l=r[s];null!==(n=l.exec(t));)o.push(entities.decode(n[1]));return e.links=o,e}}module.exports=SCREENPARSER;