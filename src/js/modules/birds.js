import mainHTML from './../text/main.html!text'
import $ from './../lib/jquery'
import Ractive from './../lib/ractive'
import moment from 'moment'
import reqwest from 'reqwest'

export class Birds {

    constructor(el, data) {

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

        this.database = data.sheets.Sheet1;

        this.database.forEach(function(value, index) {
            value["id"] = +value["id"]
            value["species"] = value["species-name"]
        });

        this.database.shuffle();

        this.memory = null;

        var check = localStorage.getItem("entry.1549969409");

        if (check!=null) {
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
                console.log(species)
                self.otherform(species)
            }
        })

        if (this.memory==null) {

            this.memory = localStorage.getItem("entry.1549969409");

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

    otherform(species) {

        var self = this
        
        this.transit('https://docs.google.com/a/guardian.co.uk/forms/d/e/1FAIpQLSe9T84ewAMzjHOfWFzjxQQrqNrvezfjdgSQIl5CwmDLzYsQ4A/formResponse', {

            "entry.1549969409.other_option_response" : species,
            "entry.1549969409": "__other_option__"

        }, 'post','hiddenForm')

        this.memory = moment().unix()

        localStorage.setItem('entry.1549969409', self.memory);

    }

    formulate(id) {

        var self = this
        
        this.transit('https://docs.google.com/a/guardian.co.uk/forms/d/e/1FAIpQLSe9T84ewAMzjHOfWFzjxQQrqNrvezfjdgSQIl5CwmDLzYsQ4A/formResponse', {

            "entry.1549969409": 'Option ' + id,

        }, 'post','hiddenForm')

        this.memory = moment().unix()

        localStorage.setItem('entry.1549969409', self.memory);
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

    prepare() {

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
