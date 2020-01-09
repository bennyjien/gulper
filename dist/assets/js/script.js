"use strict";var animate={fadeIn:function(e,t,a){var o=2<arguments.length&&void 0!==a?a:0;gsap.set(e,{display:"block",autoAlpha:1,duration:t/1e3,delay:o}),gsap.from(e,{autoAlpha:0,duration:t/1e3,delay:o})},fadeOut:function(e,t,a){var o=2<arguments.length&&void 0!==a?a:0;gsap.to(e,{display:"none",autoAlpha:0,duration:t/1e3,delay:o})},slideDown:function(e,t,a){var o=2<arguments.length&&void 0!==a?a:0;gsap.set(e,{display:"block",overflow:"visible",autoAlpha:1,height:"auto"}),gsap.from(e,{overflow:"hidden",autoAlpha:0,height:0,duration:t/1e3,delay:o})},slideUp:function(e,t,a){var o=2<arguments.length&&void 0!==a?a:0;gsap.to(e,{display:"none",overflow:"hidden",autoAlpha:0,height:0,duration:t/1e3,delay:o})}};function smoothScroll(e,t){var a=t.dataset.scrollTarget||t.hash||"",o=document.querySelector("[id='".concat(a.substring(1),"']")),n=t.dataset.scrollDuration||.4,r=(document.querySelector(t.dataset.scrollOffset)||"").offsetHeight||0;o&&(gsap.to(window,{duration:n,scrollTo:{y:a,offsetY:r}}),e.preventDefault())}function getParameterByName(e,t){t=t||window.location.href,e=e.replace(/[[\]]/g,"\\$&");var a=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);return a?a[2]?decodeURIComponent(a[2].replace(/\+/g," ")):"":null}function hasChild(e,t){for(var a=t.parentNode;null!==a;){if(a==e)return!0;a=a.parentNode}return!1}function mousePos(e){var t=0,a=0;return(e=e||window.event).pageX||e.pageY?(t=e.pageX,a=e.pageY):(e.clientX||e.clientY)&&(t=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,a=e.clientY+document.body.scrollTop+document.documentElement.scrollTop),{x:t,y:a}}function elementMover(e){document.querySelectorAll(e).forEach(function(e){return function(e){var t=e;t.insertAdjacentHTML("beforebegin",'<div class="js-mover-source"></div>');var a=t.previousElementSibling,o=document.querySelector(t.dataset.moverTarget),n=t.dataset.moverBreakpoint,r=document.documentElement.clientWidth;n<=r&&o.appendChild(t),window.addEventListener("resize",function(){r=document.documentElement.clientWidth,n<=r?t.parentNode!==o&&o.appendChild(t):t.parentNode!==a&&a.parentNode.insertBefore(t,a.nextSibling)})}(e)})}function equalHeighter(e){var t,a,o=0,n=0,r=[],i=0;function s(e){document.querySelectorAll(e).forEach(function(e){if((t=e).style.minHeight=0,i=t.getBoundingClientRect().top,n!==i){for(a=0;a<r.length;a++)r[a].style.minHeight=o+"px";r.length=0,n=i,o=t.offsetHeight,r.push(t)}else r.push(t),o=o<t.offsetHeight?t.offsetHeight:o;for(a=0;a<r.length;a++)r[a].style.minHeight=o+"px"})}s(e),window.addEventListener("resize",function(){o=0,s(e)})}function formFiler(e){document.querySelectorAll(e).forEach(function(e){var t=e.querySelector(".form-file-field"),a=t.querySelector(".input"),d=t.querySelector(".label"),o=t.querySelector(".remove"),p=d.querySelector(".placeholder"),n=p.innerHTML;function u(e){a.value="",p.innerHTML=n,d.classList.remove("has-placeholder"),e.preventDefault()}a.addEventListener("change",function(e){!function(e,t){var a=e.files,o="",n=0,r=!0,i=!1,s=void 0;try{for(var l,c=a[Symbol.iterator]();!(r=(l=c.next()).done);r=!0){n+=l.value.size}}catch(e){i=!0,s=e}finally{try{r||null==c.return||c.return()}finally{if(i)throw s}}n=Math.round(n/1024/1024*100)/100,e.files&&1<e.files.length?o="".concat((e.getAttribute("data-multiple-placeholder")||"").replace("{count}",e.files.length)," (").concat(n,"MB)"):t.target.value&&(o="".concat(t.target.value.split("\\").pop(),' <span class="filesize">(').concat(n,"MB)</span>")),o?(p.innerHTML=o,d.classList.add("has-placeholder")):u(t)}(this,e)}),o&&o.addEventListener("click",function(e){u(e)})})}function formSetter(e){document.querySelectorAll(e).forEach(function(i){i.querySelectorAll(".input").forEach(function(t){t.addEventListener("focus",function(){this.parentNode.classList.add("is-filled")}),t.addEventListener("blur",function(){var e=this;setTimeout(function(){""===e.value&&e.parentNode.classList.remove("is-filled")},100)}),window.addEventListener("load",function(){var e=t.closest(".form-input-field");e&&(e.classList.add("is-loaded"),t.value&&e.classList.add("is-filled"))});var a=i.querySelector(".form-input-password .input"),e=i.querySelector(".form-input-password .action");e&&e.addEventListener("click",function(e){"password"===a.type?a.type="text":a.type="password",e.preventDefault()});var o=i.querySelector(".form-input-date");if(o){var n=o.querySelector(".input"),r=n.dataset.dateFormat?n.dataset.dateFormat:"DD-MM-YYYY";new Pikaday({field:n,format:r,minDate:new Date})}})})}function popper(e){var g=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},o=document.querySelector("body");function m(e,t,a){t.classList.add("".concat(a.targetClass,"-toggler")),t.classList.add("is-popping"),a.targetEl.classList.add("is-popping"),o.classList.add("".concat(a.bodyClass,"-is-popping"),"".concat(a.targetClass,"-is-popping")),"slide"===a.animation&&animate.slideDown(a.targetEl,a.duration),"fade"===a.animation&&animate.fadeIn(a.targetEl,a.duration),setTimeout(function(){t.classList.add("is-popped"),a.targetEl.classList.add("is-popped"),o.classList.add("".concat(a.bodyClass,"-is-popped"),"".concat(a.targetClass,"-is-popped")),t.classList.remove("is-popping"),a.targetEl.classList.remove("is-popping"),o.classList.remove("".concat(a.bodyClass,"-is-popping"),"".concat(a.targetClass,"-is-popping"))},a.duration),a.onOpen&&a.onOpen(),a.focus&&document.querySelector(a.focus).focus(),a.scrollTarget&&smoothScroll(e,t)}function v(e,t){var a=document.querySelector(".".concat(t.targetClass,"-toggler"));e.classList.add("is-unpopping"),t.targetEl.classList.add("is-unpopping"),o.classList.add("".concat(t.bodyClass,"-is-unpopping"),"".concat(t.targetClass,"-is-unpopping")),e.classList.remove("is-popped"),t.targetEl.classList.remove("is-popped"),o.classList.remove("".concat(t.bodyClass,"-is-popped"),"".concat(t.targetClass,"-is-popped")),a.classList.remove("is-popped","".concat(t.targetClass,"-toggler")),"slide"===t.animation&&animate.slideUp(t.targetEl,t.duration),"fade"===t.animation&&animate.fadeOut(t.targetEl,t.duration),setTimeout(function(){e.classList.remove("is-unpopping"),t.targetEl.classList.remove("is-unpopping"),o.classList.remove("".concat(t.bodyClass,"-is-unpopping"),"".concat(t.targetClass,"-is-unpopping"))},t.duration)}function h(e,t,a){t.classList.add("is-unselectable"),"mouseover"===e.type||"touchstart"===e.type?m(e,t,a):"mouseout"!==e.type&&"touchend"!==e.type||v(t,a)}document.querySelectorAll(e).forEach(function(n){var e,t,a=n.dataset.popperTarget||n.hash,o="".concat(a," > *"),r=document.querySelector(a),i=a.substring(1),s=g.bodyClass,l="child"===n.dataset.popperArea||n.dataset.popperArea||"child"===g.area?o:g.area||a,c=n.dataset.popperAnimation||g.animation||"manual",d=n.dataset.popperDuration||g.duration||0,p=n.dataset.popperTrigger||g.trigger||"click",u=n.hasAttribute("data-popper-escape")||g.escape,f={target:a,targetEl:r,targetClass:i,bodyClass:s,area:l,animation:c,duration:d,trigger:p,escape:u,focus:n.dataset.popperFocus||g.focus,pop:n.hasAttribute("data-popper-pop")||g.pop,onOpen:g.onOpen,scrollTarget:n.dataset.scrollTarget};e=n,(t=f).pop&&m(event,e,t),"click"===p?window.addEventListener("click",function(e){var t,a,o;a=n,o=f,(t=e).target!==a&&t.target.closest(o.area)&&!hasChild(a,t.target)||(t.preventDefault(),a.classList.contains("is-popped")||o.targetEl.classList.contains("is-popped")?v(a,o):t.target===a&&m(t,a,o))}):"hover"===p&&(n.addEventListener("mouseover",function(e){h(e,n,f)}),n.addEventListener("touchstart",function(e){h(e,n,f)}),n.addEventListener("mouseout",function(e){h(e,n,f)}),n.addEventListener("touchend",function(e){h(e,n,f)})),u&&window.addEventListener("keydown",function(e){var t,a;"Escape"===e.key&&(a=f,((t=n).classList.contains("is-popped")||a.targetEl.classList.contains("is-popped"))&&v(t,a))})})}function scrollAnimater(e){var t=document.querySelectorAll(e),p=document.querySelector("#site-container"),u=new ScrollMagic.Controller({refreshInterval:0});t.forEach(function(t){var a=t.children,o=t.dataset.sceneHook||.8,n=t.dataset.sceneOffset||0,r=t.dataset.sceneStagger||0,i=t.dataset.sceneStaggerDuration||r*t.children.length,s=t.dataset.sceneParallax||0,e=t.dataset.sceneParallaxSpeed||1,l=t.dataset.sceneParallaxType||"transform",c=s?t.offsetHeight/e:0,d=!r;imagesLoaded(p,function(){var e;t.magic=new ScrollMagic.Scene({triggerElement:t,triggerHook:o,duration:c,offset:n,reverse:d}).setClassToggle(t,"in-viewport").addTo(u),s&&("transform"===l?e=gsap.from(t,{duration:1,y:"".concat(s,"%")}):"background"===l&&(e=gsap.from(t,{duration:1,backgroundPositionY:"".concat(s,"%")})),t.magic.setTween(e)),r&&t.magic.on("start",function(){gsap.to(a,{duration:i,stagger:{amount:r,onStart:function(){this._targets[0].classList.add("in-viewport")}}})})})})}function scrollViewer(e){var t=document.querySelectorAll(e),i=new ScrollMagic.Controller;t.forEach(function(t){function a(){return r=n.offsetHeight}var o,e,n,r;t.addEventListener("click",function(e){smoothScroll(e,t)}),e=(o=t).dataset.scrollTarget||o.hash||"",n=document.querySelector('[id="'.concat(e.substring(1),'"]')),r=n.offsetHeight,imagesLoaded(n,function(){var e=new ScrollMagic.Scene({triggerElement:n,triggerHook:.5,duration:r,reverse:!0}).setClassToggle([o,n],"in-viewport").addTo(i);window.addEventListener("resize",a),e.duration(a)})})}function tabber(e){var d=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},t=document.querySelectorAll(e);function p(e,t){t.forEach(function(e){e.hidden=!0}),e.forEach(function(e){e.setAttribute("aria-selected",!1)})}t.length&&t.forEach(function(e){var t,a,o,n,r,i=e.querySelectorAll('[role="tab"]'),s=e.querySelectorAll('[role="tabpanel"]'),l=e.hasAttribute("data-tab-deeplink")||d.deeplink,c=getParameterByName("tab");e.addEventListener("click",function(e){e.target.matches('[role="tab"]')&&function(e,t,a,o){p(t,a),e.target.setAttribute("aria-selected",!0);var n=e.target.id;(a=Array.from(a)).find(function(e){return e.getAttribute("aria-labelledby")===n}).hidden=!1,o&&window.history&&history.pushState&&history.replaceState("","","?tab=".concat(n))}(e,i,s,l)}),t=e,a=l,o=c,p(i,s),a&&o&&(n=t.querySelector("#".concat(o)),r=t.querySelector("[aria-labelledby=".concat(o,"]"))),n||(n=t.querySelector('[role="tab"]'),r=t.querySelector('[role="tabpanel"]')),n.setAttribute("aria-selected",!0),r.hidden=!1})}elementMover.version="1.0.0",equalHeighter.version="1.0.0",formFiler.version="1.0.0",formSetter.version="1.0.0",popper.version="1.0.0",scrollAnimater.version="1.0.0",scrollViewer.version="1.0.0",tabber.version="2.0.0",imagesLoaded("#site-container",function(){document.body.classList.remove("site-loading")}),fluidvids.init({selector:[".js-video"],players:["www.youtube.com"]}),elementMover(".js-mover"),formFiler(".js-form-file"),formSetter(".js-form-input"),popper(".js-popup-inline",{duration:200,bodyClass:"popup-inline",area:"child",escape:!0}),popper(".js-popup-modal",{duration:200,bodyClass:"popup-inline",area:"#site-container"}),popper(".js-toggle"),scrollAnimater(".js-scene"),scrollViewer(".js-scroll"),tabber(".js-tab");