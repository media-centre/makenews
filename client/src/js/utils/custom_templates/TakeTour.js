"use strict";

export default class TakeTour {
    static show() {
        let takeTourMaskElement = document.getElementById("take-tour-mask");
        if(takeTourMaskElement === null) {
            takeTourMaskElement = document.createElement("div");
            takeTourMaskElement.id = "take-tour-mask";
            takeTourMaskElement.className = "take-tour-mask mask";
            takeTourMaskElement.innerHTML = "<div class='take-tour bottom-box-shadow anim' id='take-tour'>" +
                                            "<div class='tour-popup'>" +
                                                "<p class='description'></p>" +
                                                "<div class='t-right'>" +
                                                    "<button id='tour-continue'>Continue</button>" +
                                                    "<button id='tour-abort'>Abort</button>" +
                                                "</div>" +
                                            "</div>" +
                                        "</div>";
            document.body.appendChild(takeTourMaskElement);

            document.getElementById("tour-continue").addEventListener("click", ()=> {
                TakeTour.next();
            });

            document.getElementById("tour-abort").addEventListener("click", ()=> {
                TakeTour.close();
            });

            window.addEventListener("resize", ()=> {
                TakeTour.navigateToPosition();
            });
        }
        document.body.style.overflow = "hidden";

        TakeTour.currentIndex = -1;
        TakeTour.schema = TakeTour.getJson();
        TakeTour.startNavigation();
    }

    static startNavigation() {
        document.getElementById("take-tour-mask").classList.remove("hide");
        document.getElementById("tour-continue").classList.remove("hide");
        TakeTour.currentIndex += 1;
        TakeTour.navigateToPosition();
        TakeTour.updateContent();
    }

    static next() {
        if(TakeTour.schema.navigation.length > TakeTour.currentIndex) {
            TakeTour.clickTargetElement();
            if(TakeTour.schema.navigation.length - 1 === TakeTour.currentIndex) {
                document.getElementById("tour-continue").classList.add("hide");
            } else {
                TakeTour.currentIndex += 1;
            }
            TakeTour.navigateToPosition();
            TakeTour.updateContent();
        }
    }

    static clickTargetElement() {
        let currentJsonElement = TakeTour.getCurrentJsonElement();
        document.querySelector(currentJsonElement.actionSelector).click();
    }

    static updateContent() {
        let takeTourElement = document.getElementById("take-tour");
        let descriptionDom = takeTourElement.getElementsByClassName("description")[0];

        let currentJsonElement = TakeTour.getCurrentJsonElement();
        if(descriptionDom.textContent !== currentJsonElement.content) {
            descriptionDom.textContent = currentJsonElement.content;
        }
    }

    static navigateToPosition() {
        let time = 100, padding = 20;
        setTimeout(()=> {
            let currentJsonElement = TakeTour.getCurrentJsonElement();
            let takeTourElement = document.getElementById("take-tour");
            let targetElement = document.querySelector(currentJsonElement.selector);
            let top = (targetElement.offsetTop + targetElement.offsetHeight + padding);
            let left = (targetElement.offsetLeft + (targetElement.offsetWidth / 2) - (takeTourElement.offsetWidth / 2));
            left = left < 0 ? padding : left;
            takeTourElement.style.top = top + "px";
            takeTourElement.style.left = left + "px";
        }, time);
    }

    static getCurrentJsonElement() {
        return TakeTour.schema.navigation[TakeTour.currentIndex];
    }

    static close() {
        TakeTour.currentIndex = -1;
        TakeTour.schema = [];
        document.getElementById("take-tour-mask").classList.add("hide");
        document.body.style.overflow = "auto";
    }

    static getJson() {
        return {
            "navigation": [
                {
                    "selector": ".menu-list > li:first-child",
                    "actionSelector": ".menu-list > li:first-child a",
                    "content": "Click here to configure"
                },
                {
                    "selector": "#addNewCategoryButton",
                    "actionSelector": "#addNewCategoryButton",
                    "content": "Click here to create a new category"
                },
                {
                    "selector": "#categoryTitle",
                    "actionSelector": "#categoryTitle",
                    "content": "Enter your category name"
                },
                {
                    "selector": "#deleteCategory",
                    "actionSelector": ".category-page .tab-control > .tab-header > .tab:first-child",
                    "content": "Click here to delete this category"
                },
                {
                    "selector": ".category-page .tab-control > .tab-header > .tab:first-child",
                    "actionSelector": "#addNewUrlButton",
                    "content": "Click here to add news RSS, FACEBOOK and TWITTER"
                },
                //{
                //    "selector": "#addNewUrlButton",
                //    "actionSelector": "#addNewUrlButton",
                //    "content": "Click here to add URL to get news"
                //},
                {
                    "selector": ".url-panel .add-url-input",
                    "actionSelector": ".url-panel .add-url-input",
                    "content": "Enter or paste your URL in the input",
                    "value": "http://www.thehindu.com/opinion/?service=rss",
                    "action": "ENTER"
                },
                //{
                //    "selector": ".url-list li:first-child div i.close",
                //    "actionSelector": ".url-list li:first-child div i.close",
                //    "content": "Click here to delete this URL"
                //},
                {
                    "selector": "#allCategoriesButton",
                    "actionSelector": "#allCategoriesButton",
                    "content": "Click here to move back to the Configure page"
                },
                {
                    "selector": ".menu-list > li:nth-child(2)",
                    "actionSelector": ".menu-list > li:nth-child(2) a",
                    "content": "Click here to view the news from configured URLs"
                },
                //{
                //    "selector": ".surf-refresh-button",
                //    "actionSelector": ".surf-refresh-button",
                //    "content": "Click here to get the latest feeds from the configured URLs"
                //},
                //{
                //    "selector": ".surf-page-container .all-feeds > div:first-child .park-feed",
                //    "actionSelector": ".surf-page-container .all-feeds > div:first-child .park-feed",
                //    "content": "Click here to park the news item for later use"
                //},
                {
                    "selector": ".main-page > header",
                    "actionSelector": "#filterToggle",
                    "content": "Click here to set filters to the news items"
                },
                {
                    "selector": ".menu-list > li:nth-child(3)",
                    "actionSelector": ".menu-list > li:nth-child(3) a",
                    "content": "Click here to view the news items that have been parked for later use"
                }
                //,{
                //    "selector": ".park-page .all-feeds > div:first-child .park-feed",
                //    "actionSelector": ".park-page .all-feeds > div:first-child .park-feed",
                //    "content": "Click here to un-park or remove the news"
                //},
                //{
                //    "selector": "header .user-info > a",
                //    "actionSelector": "header .user-info > a",
                //    "content": "Click here to logout from the application"
                //}
            ]
        };
    }
}
