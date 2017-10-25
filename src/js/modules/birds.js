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

        if (voted==null) {
            $( ".vote" ).css('display','block').click(function() {
                self.formulate($(this).data('id'))
                $('.vote').css('display','none');
            })
        } else {
            this.prepare()
        }

    }

    formulate(id) {
        
        this.transit('https://docs.google.com/a/guardian.co.uk/forms/d/e/1FAIpQLSe9T84ewAMzjHOfWFzjxQQrqNrvezfjdgSQIl5CwmDLzYsQ4A/formResponse', {

            "entry.1549969409": 'Option ' + id,

        }, 'post','hiddenForm')

        //localStorage.setItem('entry.1549969409', moment().unix());
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

        reqwest({
            url: 'https://interactive.guim.co.uk/2017/08/ceo-results/ceo-results.json',
            crossOrigin: true,
            success: (resp) => {

                var votes = resp

                var questions = ["Question_1a","Question_1b",
                        "Question_2a","Question_2b",
                        "Question_3a","Question_3b",
                        "Question_4a","Question_4b",
                        "Question_5a","Question_5b",
                        "Question_6a","Question_6b",
                        "Question_7a","Question_7b",
                        "Question_8a","Question_8b",
                        "Question_9a","Question_9b",
                        "Question_10a","Question_10b",
                        "Question_11a","Question_11b"]


                var ballotbox = document.getElementsByClassName('votally');

                $('.votally').css('display','block')

                for (var i = 0; i < ballotbox.length; i++) {

                    try {
                        ballotbox[i].innerHTML = votes[questions[i]].average + ' votes'
                    } catch(err) {
                        console.log(err.message)
                    }

                }

            }

        });

    }

}
