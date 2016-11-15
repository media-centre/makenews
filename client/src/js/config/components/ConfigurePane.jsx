import React, { Component } from "react";
import SourcesResults from "./SourcesResults";

export default class Configure extends Component {
    render() {
        let sources = [
            { "name": "Anurag Shinde", "url": "http://facebook.com/anuragshinde/profile" },
            { "name": "Barkha Datt", "url": "http://facebook.com/barkhadatt/profile" },
            { "name": "Aditi Nigam", "url": "http://facebook.com/aditinigam/profile" },
            { "name": "Chandan Rao", "url": "http://facebook.com/chandanrao/profile" },
            { "name": "Leena Nanda", "url": "http://facebook.com/leenananda/profile" },
            { "name": "Jyoti Kulkarni", "url": "http://facebook.com/jyotikulkarni/profile" },
            { "name": "Meena Bora", "url": "http://facebook.com/meenabora/profile" },
            { "name": "Keval Mutthal", "url": "http://facebook.com/kevalmutthal/profile" },
            { "name": "Parth Sharma", "url": "http://facebook.com/parthsharma/profile" },
            { "name": "Rahul Rathod", "url": "http://facebook.com/rahulrathod/profile" },
            { "name": "Pallavi Mishra", "url": "http://facebook.com/pallavimishra/profile" },
            { "name": "Shantanu Sagale", "url": "http://facebook.com/shantanusagale/profile" },
            { "name": "Jay Inamdar", "url": "http://facebook.com/jayinamdar/profile" },
            { "name": "Kush Moryani", "url": "http://facebook.com/kushmoryani/profile" },
            { "name": "Nikita Oswal", "url": "http://facebook.com/nikitaoswal/profile" },
            { "name": "Priyanka Khan", "url": "http://facebook.com/priyankakhan/profile" },
            { "name": "Manali Chopra", "url": "http://facebook.com/manalichopra/profile" },
            { "name": "Raj Shelar", "url": "http://facebook.com/rajshelar/profile" },
            { "name": "Monty Singh", "url": "http://facebook.com/montysingh/profile" },
            { "name": "Parul Patel", "url": "http://facebook.com/parulpatel/profile" },
            { "name": "Arun Dhingra", "url": "http://facebook.com/arundhingra/profile" }
        ];
        
        return (
          <div className="configure-sources">
              <input type="text" className="search-sources" placeholder="Search...."/>
              <SourcesResults sources={sources}/>
          </div>
        );
    }
}
