import { FACEBOOK_SEARCH_SOURCES } from "./../actions/FacebookConfigureActions";

export function facebookConfiguredUrls() {
    
    return {
        "friends": [
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
        ],
        "groups": [
            { "name": "Journalist India", "url": "http://facebook.com/journalistindia/group" },
            { "name": "Voice of Journalist", "url": "http://facebook.com/voiceofjournalist/group" },
            { "name": "TV Journalist Association", "url": "http://facebook.com/tvjournalistassociation/group" },
            { "name": "Sherlock", "url": "http://facebook.com/sherlock/group" },
            { "name": "Health News", "url": "http://facebook.com/healthnews/group" },
            { "name": "Science and Philosophy", "url": "http://facebook.com/scienceandphilosophy/group" },
            { "name": "NID in Media", "url": "http://facebook.com/nidinmedia/group" },
            { "name": "News 24-7", "url": "http://facebook.com/news24-7/group" },
            { "name": "Biotech United", "url": "http://facebook.com/biotechunited/group" },
            { "name": "India Online", "url": "http://facebook.com/indiaonline/group" },
            { "name": "Politics and News", "url": "http://facebook.com/politicsandnews/group" },
            { "name": "BBC Volunteer Group", "url": "http://facebook.com/bbcvolunteergroup/group" },
            { "name": "TOI News", "url": "http://facebook.com/toinews/group" },
            { "name": "India News Daily", "url": "http://facebook.com/indianewsdaily/group" },
            { "name": "News Collection", "url": "http://facebook.com/newscollection/group" },
            { "name": "Indian Railways News Center", "url": "http://facebook.com/indiarailwaynews/group" },
            { "name": "Mumbai Times", "url": "http://facebook.com/mumbaitimes/group" },
            { "name": "Daily News", "url": "http://facebook.com/dailynews/group" }
        ],
        "pages": [
            { "name": "Deccan News", "url": "https://www.facebook.com/deccannews" },
            { "name": "DNA India", "url": "https://www.facebook.com/dnaindia" },
            { "name": "Economic Times", "url": "https://www.facebook.com/EconomicTimes/" },
            { "name": "Indian Express", "url": "https://www.facebook.com/indianexpress" },
            { "name": "NDTV", "url": "https://www.facebook.com/ndtv/" },
            { "name": "Scroll", "url": "https://www.facebook.com/scroll.in" },
            { "name": "The Guardian", "url": "https://www.facebook.com/theguardian/" },
            { "name": "The Hindu", "url": "https://www.facebook.com/thehindu" },
            { "name": "The Wire", "url": "https://www.facebook.com/TheWire" }
        ]
    };
}

export const facebookUrls = (state = [], action = {}) => {
    switch(action.type) {
    case FACEBOOK_SEARCH_SOURCES: {
        state.push({
            "name": action.keyword
        });

        return Object.assign([], state);
    }
    default: return state;
    }
};
