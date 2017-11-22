import mainHTML from './../text/main.html!text'
import scoreboard from './../text/scoreboard.html!text'
import $ from './../lib/jquery'
import Ractive from './../lib/ractive'
import moment from 'moment'
import reqwest from 'reqwest'
import Fingerprint2 from 'fingerprintjs2'
import md5 from 'md5';

export class Birds {

    constructor(el, data) {

        var self = this

        self.powerful = md5(self.prefixer())

        Ractive.DEBUG = false;

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

        self.powerful += '-'

        this.ls = this.storageAvailable('localStorage')

        new Fingerprint2().get(function(result){
          self.powerful += result;
        });

        this.database = data.sheets.Sheet1;

        this.database.forEach(function(value, index) {
            value["id"] = +value["id"]
            value["species"] = value["species-name"]
            value["votes"] = 0
        });

        this.database.shuffle();

        this.memory = null;

        var check = null;

        if (this.ls) {
            check = localStorage.getItem("entry.1549969409");
        }

        if (check!=null && this.ls) {
            this.memory = localStorage.getItem("entry.1549969409");
        }

        /*
        description
        img
        name
        species-name
        species
        id
        */

        this.element = el

        this.compile()

    }

    prefixer() { 

        var isInIframe = (parent !== window);
        var parentUrl = null;
        var shareUrl = (isInIframe) ? document.referrer : window.location.href;
        shareUrl = shareUrl.split('?')[0]
        return shareUrl;

    }

    storageAvailable(type) {
       try {
           var storage = window[type],
               x = '__storage_test__';
           storage.setItem(x, x);
           storage.removeItem(x);
           return true;
       }
       catch(e) {
           return false;
       }
    }

    compile() {

        var self = this

        var ractive = new Ractive({
            el: self.element,
            data: { bird : self.database },
            template: mainHTML
        });

        $( "#other_submit" ).css('display','block').click(function() {

            if ($('#other_species').val() && $('#other_species').val().length > 3) {
                var species = $('#other_species').val();
                $('.vote').css('display','none');
                $('.other_block').css('display','none');
                self.otherform(species)
            }
        })

        $( "#leaderboard_button").click(function() {
            self.scoreboard()
        })
        
        if (this.memory==null) {

            $( ".vote" ).css('display','block').click(function() {
                self.id = $(this).data('id')
                self.formulate(self.id)
                $('.vote').css('display','none');
                $('.other_block').css('display','none');
            })

        } else {
            $('.vote').css('display','none');
            $('.other_block').css('display','none');
            this.prepare()
        }

    }

    heroku(datum) {

        var self = this

        reqwest({
            url: 'https://twitchers.herokuapp.com/api/', 
            method: 'post',
            data: { datum: datum },
            crossOrigin: true,
            success: (resp) => {

                console.log(resp)

                self.prepare()

            }

        });

        this.memory = moment().unix()

        if (this.ls) {
            localStorage.setItem('entry.1549969409', self.memory);
        }

    }

    otherform(species) {

        var self = this
        
        var datum = { "entry.1549969409.other_option_response" : species,"entry.1549969409": "__other_option__","entry.1278920154":  self.powerful }

        this.heroku(JSON.stringify(datum))

    }

    formulate(id) {

        var self = this
        
        var datum = { "entry.1549969409": 'Option ' + id, "entry.1278920154": self.powerful }

        this.heroku(JSON.stringify(datum))

    }

    updated() {

        document.querySelector('#timestamp').innerHTML = 'Results last updated: ' + moment().format("hh:mm A")

    }

    transit(path, params, method, target) {

        method = method || "post";

        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", path);
        form.setAttribute("target", target);
        
        for(var key in params) {
            if(params.hasOwnProperty(key)) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);

                form.appendChild(hiddenField);
             }
        }

        document.body.appendChild(form);
        form.submit();
        // Load the results now.
        this.prepare()

    }
    
    scoreboard() {

        var self = this

        reqwest({
            url: 'https://interactive.guim.co.uk/2017/10/australian-bird-survey/bird-quiz-results.json', 

            crossOrigin: true,
            success: (resp) => {

                var votes = resp

                self.database.forEach(function(value, index) {
                    let id = 'id'+value["id"]
                    value["votes"] = votes[id].votes
                });

                self.database.sort(function(a, b) {
                    return b["votes"] - a["votes"]
                });

                var max = self.database[0].votes

                self.database.forEach(function(value, index) {
                    value["rank"] = index + 1
                    value['barWidth'] = (value['votes']/max)*100;
                });

                var ractive = new Ractive({
                    el: self.element,
                    data: { results : self.database },
                    template: scoreboard
                });

                self.updated() 

                $( "#standard_button").click(function() {
                    self.compile()
                })


            }

        });

    }
    
    prepare() {

        $('#leaderboard_button').css('display','block')

        var self = this

        reqwest({
            url: 'https://interactive.guim.co.uk/2017/10/australian-bird-survey/bird-quiz-results.json', 

            crossOrigin: true,
            success: (resp) => {

                var votes = resp

                var options = []

                for (var i = 0; i < 50; i++) {
                    options.push('id'+(i+1))
                    //console.log(resp['id'+(i+1)])
                }

                var ballotbox = document.getElementsByClassName('votally');

                $('.votally').css('display','block')

                for (var i = 0; i < ballotbox.length; i++) {

                    let id = 'id'+self.id;
                    let count = (options[i]==id) ? votes[options[i]].votes + 1 : votes[options[i]].votes
                    try {
                        $('#'+options[i]).html(count + ' votes')
                    } catch(err) {
                        console.log(err.message)
                    }

                }

            }

        });

    }

}
