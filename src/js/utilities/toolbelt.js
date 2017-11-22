export class Toolbelt {

    constructor() {

        var self = this

        // Make a random shuffle function for arrays just like they did in underscore
        Array.prototype.shuffle = function() {
          var i = this.length, j, temp;
          if ( i == 0 ) return this;
          while ( --i ) {
             j = Math.floor( Math.random() * ( i + 1 ) );
             temp = this[i];
             this[i] = this[j];
             this[j] = temp;
          }
          return this;
        }

    }

    readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    toTitleCase(string) {
        return string.toLowerCase().replace(/_/g, ' ').replace(/\b([a-z\u00C0-\u00ff])/g, function (_, initial) {
          return initial.toUpperCase();
        }).replace(/(\s(?:de|a|o|e|da|do|em|ou|[\u00C0-\u00ff]))\b/ig, function (_, match) {
          return match.toLowerCase();
        });
    }

    makeItLookNice(num) {
        var result = parseFloat(num).toFixed();
        result = result.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        return result
    }

    localStorage() {
        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem('verify', 'confirm');
                if (localStorage.getItem('verify') === 'confirm') {
                    localStorage.removeItem('verify');
                    //localStorage is enabled
                    this.localstore = true;
                } else {
                    //localStorage is disabled
                    this.localstore = false;
                }
            } catch(e) {
                //localStorage is disabled
                this.localstore = false;
            }
        } else {
            //localStorage is not available
            this.localstore = false;
        }
        return this.localstore
    }

    clearout(target) {
        localStorage.removeItem(target);
    }

    getShareUrl() { 
        var isInIframe = (parent !== window);
        var parentUrl = null;
        shareUrl = (isInIframe) ? document.referrer : shareUrl = window.location.href;
        return shareUrl;  
    }

}
