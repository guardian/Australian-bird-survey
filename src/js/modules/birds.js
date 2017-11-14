import mainHTML from './../text/main.html!text'
import $ from './../lib/jquery'
import Ractive from './../lib/ractive'
import moment from 'moment'
import reqwest from 'reqwest'

export class Birds {

    constructor(el, data) {

        this.database = data.sheets.Sheet1;

        this.database.forEach(function(value, index) {
            value["id"] = index + 1;
            value["species"] = value["species-name"]
        });

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

        var voted = localStorage.getItem("entry.1549969409");

        // This is for testing only. Swich it out witht the code below when you are going live
        $( ".vote" ).css('display','block').click(function() {
            self.id = $(this).data('id')
            self.formulate(self.id)
            console.log(self.id)
            $('.vote').css('display','none');
        })
        

        /*
        if (voted==null) {
            $( ".vote" ).css('display','block').click(function() {
                self.id = $(this).data('id')
                self.formulate(self.id)
                $('.vote').css('display','none');
            })
        } else {
            $('.vote').css('display','none');
            this.prepare()
        }
        */
        

    }

    formulate(id) {
        
        this.transit('https://docs.google.com/a/guardian.co.uk/forms/d/e/1FAIpQLSe9T84ewAMzjHOfWFzjxQQrqNrvezfjdgSQIl5CwmDLzYsQ4A/formResponse', {

            "entry.1549969409": 'Option ' + id,

        }, 'post','hiddenForm')

        localStorage.setItem('entry.1549969409', moment().unix());
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
