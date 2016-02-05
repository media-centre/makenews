"use strict";

export default class TakeTour {
    static show() {
        let takeTourElement = document.getElementById("take-tour");
        if(takeTourElement === null) {
            takeTourElement = document.createElement("div");
            takeTourElement.id = "take-tour";
            takeTourElement.className = "take-tour";
            takeTourElement.innerHTML = "<div class='tour-popup'><p class='description'></p><div class='t-right'><button id='tour-continue'>Continue</button><button id='tour-abort'>Abort</button></div></div>";
            document.body.appendChild(takeTourElement);

            document.getElementById("tour-continue").addEventListener("click", ()=> {
                TakeTour.next();
            });
        }

        TakeTour.currentIndex = -1;
        TakeTour.total = TakeTour.total || TakeTour.getJson().navigation.length;
        TakeTour.startNavigation();

    }

    static startNavigation() {
        TakeTour.next();
    }

    static next() {
        if(TakeTour.total > TakeTour.currentIndex) {
            TakeTour.currentIndex += 1;
            TakeTour.navigateToPosition();
        }
    }

    static navigateToPosition() {
        let currentJsonElement = TakeTour.getCurrentJsonElement();
        let takeTourElement = document.getElementById("take-tour");

        let descriptionDom = takeTourElement.getElementsByClassName("description")[0];
        if(descriptionDom.textContent !== currentJsonElement.content) {
            descriptionDom.textContent = currentJsonElement.content;
        }

        let targetElement = document.querySelector(currentJsonElement.selector);
        takeTourElement.style.top = (targetElement.offsetTop + targetElement.offsetHeight) + "px";
        takeTourElement.style.left = ((targetElement.offsetLeft + targetElement.offsetWidth) / 2) + "px";

    }

    static getCurrentJsonElement() {
        let json = TakeTour.getJson();
        return json.navigation[TakeTour.currentIndex];
    }


    static getJson() {
        return {
            "navigation": [
                {
                    "selector": ".menu-list > li:first-child a",
                    "content": "Click here to configure"
                },
                {
                    "selector": "#addNewCategoryButton",
                    "content": "Click here to create a new category"
                },
                {
                    "selector": "#categoryTitle",
                    "content": "Enter your category name"
                },
                {
                    "selector": "#deleteCategory",
                    "content": "Click here to delete this category"
                },
                {
                    "selector": ".tab-control > .tab-header > .tab:first-child",
                    "content": "Click here to add news RSS, FACEBOOK and TWITTER"
                },
                {
                    "selector": "#addNewUrlButton",
                    "content": "Click here to add URL to get news"
                },
                {
                    "selector": ".url-panel .add-url-input",
                    "content": "Enter or paste your URL in the input",
                    "value": "http://www.thehindu.com/opinion/?service=rss",
                    "action": "ENTER"
                },
                {
                    "selector": ".url-list li:first-child div i.close",
                    "content": "Click here to delete this URL"
                },
                {
                    "selector": "#allCategoriesButton",
                    "content": "Click here to move back to the Configure page"
                },
                {
                    "selector": ".menu-list > li:nth-child(2) a",
                    "content": "Click here to view the news from configured URLs"
                },
                {
                    "selector": ".surf-refresh-button",
                    "content": "Click here to get the latest feeds from the configured URLs"
                },
                {
                    "selector": ".surf-page-container .all-feeds > div:first-child .park-feed",
                    "content": "Click here to park the news item for later use"
                },
                {
                    "selector": "#filterToggle",
                    "content": "Click here to set filters to the news items"
                },
                {
                    "selector": ".menu-list > li:nth-child(3) a",
                    "content": "Click here to view the news items that have been parked for later use"
                },
                {
                    "selector": ".park-page .all-feeds > div:first-child .park-feed",
                    "content": "Click here to un-park or remove the news"
                },
                {
                    "selector": "header .user-info > a",
                    "content": "Click here to logout from the application"
                }
            ]
        };
    }
}
