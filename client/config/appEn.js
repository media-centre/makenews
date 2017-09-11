/*eslint no-multi-str:0*/
if(!window.mediaCenter) {
    window.mediaCenter = {};
}
window.mediaCenter.appEn = {
    "locales": ["en"],

    "messages": {
        "loginPage": {
            "login": {
                "loginButton": "Sign in",
                "userNamePlaceHolder": "Username",
                "passwordPlaceHolder": "Password",
                "loginHelpLabel": "Need help to login"
            },
            "watchDemo": "Watch Makenews Demo",
            "branding": {
                "text": "MakeNews is for journalists and newsrooms. It helps you track news from web and social media in real-time."
            },
            "featuresHelp": {
                "configureHelp": {
                    "name": "Add news sources",
                    "text": "Identify and add all your favourite sources from RSS feeds, Facebook and Twitter to aggregate these and create a one stop destination for all your news."
                },
                "scanNewsHelp": {
                    "name": "Scan news articles",
                    "text": "Don’t miss out on any news. Look out for all the trending and latest news. Save and sort your references and make your own news collections."
                },
                "writeStoryHelp": {
                    "name": "Write your story",
                    "text": "Write and export your own story while referring to your collections and the news world."
                }
            }
        },
        "changePassword": {
            "passwordUpdateFailure": "Password update failed",
            "invalidCredentials": "Incorrect Current Password",
            "newPwdConfirmPwdMismatch": "New Password and Confirm Password do not match",
            "currentPassword": "current password",
            "newPassword": "new password",
            "confirmPassword": "confirm password",
            "newPwdShouldNotMatchCurrentPwd": "New Password should not be same as the Current Password",
            "pwdChangeSuccessful": "Password successfully changed",
            "pwdShouldNotBeEmpty": "Passwords cannot be left blank",
            "logoutConfirmMessage": "Your password has been successfully changed. The application will now logout. Please re-login with your new password"
        },
        "userProfileStrings": {
            "changePassword": "Change Password",
            "logout": "Logout",
            "help": "Help & FAQs"
        },
        "newsBoard": {
            "filters": {
                "addHashTags": "ADD HASHTAG",
                "addTag": "ADD TAG",
                "cancelButton": "Cancel",
                "applyButton": "Apply",
                "hashTag": {
                    "alreadyExist": "Hashtag already exists",
                    "emptyHashTag": "Hashtag cannot be Empty"
                }
            },
            "defaultMessages": {
                "trending": "Please configure sources on configure page ",
                "web": "Please configure web sources on configure page ",
                "facebook": "Please configure facebook sources on configure page ",
                "twitter": "Please configure twitter sources on configure page ",
                "bookmark": "Please bookmark the feeds",
                "noFeeds": "No feeds to display"
            },
            "search": {
                "validateKey": "Please enter a keyword minimum of 3 characters",
                "errorMessage": "No Search results found for this keyword"
            },
            "showMoreFeedsButton": "Show new feeds",
            "collection": {
                "defaultMessage": "No feeds added to collection",
                "allCollections": "All Collections",
                "selectCollection": "SELECT A COLLECTION",
                "createCollection": "Create new collection",
                "readMoreButton": "Read More",
                "backButton": "BACK",
                "saveButton": "SAVE",
                "cancelButton": "CANCEL",
                "confirmDelete": "Do you really want to delete collection?",
                "deleteFailure": "Could not able to delete collection",
                "addToCollectionMessages": {
                    "createCollectionSuccess": "Successfully created collection",
                    "createCollectionFailure": "Failed to create collection",
                    "addFeedToCollectionFailure": "Failed to add feed to collection",
                    "addFeedToCollectionSuccess": "Added to"
                }
            },
            "article": {
                "defaultMessage": "",
                "backButton": "back",
                "addToCollection": "Add to Collection",
                "bookmark": "Bookmark",
                "bookmarked": "Bookmarked",
                "readOriginalArticle": "Read the Original Article",
                "deleteFailure": "Could not able to delete article",
                "fetchingArticleFailure": "Unable to get the article contents",
                "copy": "Copy"
            },
            "bookmarkSuccess": "Successfully bookmarked"
        },
        "storyBoard": {
            "createStory": "Create New Story",
            "untitledStory": "Untitled",
            "backButton": "Back",
            "saveButton": "SAVE",
            "confirmDelete": "Are you sure you want to delete the story?",
            "confirmStoryBack": "All the unsaved changes will be removed. Are you sure you want to go back?",
            "successMessages": {
                "saveStory": "Story saved successfully",
                "deleteStory": "Story deleted successfully"
            },
            "warningMessages": {
                "emptyStory": "Cannot save empty story"
            },
            "errorMessages": {
                "saveStoryFailure": "Not able to save"
            }
        },
        "mainHeaderStrings": {
            "newsBoard": "Scan News",
            "storyBoard": "Write a Story",
            "configure": "Configure"
        },
        "confirmPopup": {
            "ok": "OK",
            "confirm": "CONFIRM",
            "cancel": "CANCEL"
        },
        "helpFAQs": {
            "help": "Help",
            "FAQsHeading": "FAQs",
            "FAQs": [
                {
                    "question": "1. What are the use cases of the application?",
                    "answer": `Makenews can be used for the following purposes especially for Journalists
                    <ul style='margin-left:20px;'>
                        <li>News aggregator from websites and social networks (Facebook and Twitter)</li>
                        <li>Organising the news collection</li>
                        <li>Writing the stories</li>
                    </ul>`
                },
                {
                    "question": "2. Is there any link to see the demo of the application?",
                    "answer": `Please visit <a href='https://makenews.in'>makenews.in</a> and please use for the following credentials.
                    Username: demo
                    Password: demo`
                },
                {
                    "question": "3. Can I install the application in my own server or system?",
                    "answer": "Yes. Please follow the git instructions at URL"
                },
                {
                    "question": "4. Can I modify the code to suit the custom needs?",
                    "answer": "Yes. The application is licensed under AGPL V3."
                },
                {
                    "question": "5. Who can use this application?",
                    "answer": "This application is designed with a special emphasis for Journalists. However, it can be used by anyone who wish to update themselves with the latest news."
                },
                {
                    "question": "6. Do I need to give the credentials for Facebook and Twitter for using the application?",
                    "answer": "If the user needs information from the social networks, the user will need to give the permission to the app using the respective facebook and twitter accounts."
                },
                {
                    "question": "7. Can I follow my friends on Facebook using this application?",
                    "answer": "No. The application is meant to follow pages and groups which are public."
                },
                {
                    "question": "8. Can I get information related to hashtags?",
                    "answer": `Users can follow hashtags. The option lies under Scan news -> Twitter -> Filters.
                    However, the life of hashtags is limited to that particular session of login.`
                },
                {
                    "question": "9. To use makenews, is it mandatory to login using Facebook and Twitter?",
                    "answer": "If, you wish to scan news only from websites, in that case it is not needed to provided to provide the credentials for Facebook and Twitter."
                },
                {
                    "question": "10. Are the list of websites in the configuration page exhaustive or can I add my own url?",
                    "answer": `Yes. You can. Please click “Add URL”.
                    Please note that we need add only RSS Feed Link at the moment.
                    Want to know more about RSS. Please click <a href="https://en.wikipedia.org/wiki/RSS">here</a>`
                },
                {
                    "question": "11. How can I save my stories created in the application?",
                    "answer": "Currently the application allows the user to export the article in html format. This can be copy pasted in any editor of a CMS System or in word document without losing the style changes."
                },
                {
                    "question": "12. What are the options available to read the articles later?",
                    "answer": "Any article can be added to collections, can be bookmarked and there is also an option to add few selected lines in the article to your collections."
                },
                {
                    "question": "13. Can I able to create an account for using makenews?",
                    "answer": "This is not a SaaS implementation. There is a demo url for trying out this application. However, one can install makenews on their own computers or servers and run it."
                },
                {
                    "question": "14. How do we create users in the newly installed makenews application?",
                    "answer": "Please run the script as mentioned in the READ ME file."
                },
                {
                    "question": "15. What is the life of the data that is collected from various sources?",
                    "answer": "Currently it is set to 30 days, which means the data of past 30 days from various sources will be visible to the users."
                },
                {
                    "question": "16. Do it need to visit the webpage from the makenews to read the articles?",
                    "answer": "Not needed in most of the cases. The article can be viewed from the application."
                },
                {
                    "question": "17. Are videos played inside the application?",
                    "answer": "No. However, the external links to the video are accessible."
                },
                {
                    "question": "18. What is the expiration period for Twitter and Facebook?",
                    "answer": `<p>For Twitter, there is no expiry period.</p>
                    <p>For Facebook, the token expiration period is 60 days. So after 60 days user needs to provide the credentials of Facebook.</p>`
                }
            ]
        },
        "configurePage": {
            "header": {
                "mySources": "My Sources",
                "web": "Web URLs",
                "facebook": {
                    "name": "Facebook",
                    "tabs": {
                        "pages": "Pages",
                        "groups": "Groups"
                    }
                },
                "twitter": "Twitter",
                "next": "Next",
                "done": "Done",
                "signIn": "Sign in"
            },
            "addAll": "Add All",
            "addCustomUrl": {
                "name": "Add custom url",
                "description": {
                    "web": "Please enter the link below to add a new web source.",
                    "pages": "Please enter the link below to add a new page source.",
                    "twitter": "Please enter the link below to add a new twitter source."
                },
                "exampleUrls": {
                    "web": "http://www.thehindu.com/?service=rss",
                    "pages": "https://www.facebook.com/TimesofIndia",
                    "twitter": "@timesofindia"
                },
                "messages": {
                    "validateUrl": "Please enter proper url",
                    "success": "Added Successfully"
                }
            },
            "errorMessages": {
                "sourceDeletedFailed": "Could not delete source"
            },
            "warningMessages": {
                "configureAtLeastOneSource": "Please select at least one source either from Web Urls or Facebook or Twitter"
            }

        },
        "facebook": {
            "signInWarning": "Please, sign into your facebook account to add Facebook Groups, Pages as your sources"
        },
        "twitter": {
            "signInWarning": "Please, sign into your twitter account",
            "loginSuccess": "Login successful",
            "loginFailure": "Login failed"
        },
        "welcomePage": {
            "heading": "Hello",
            "message": "Welcome onboard. Hungry for news? Lets get started to collect and sort your news at one stop. Here are a few things you might want to know.",
            "nextButton": "Next"
        },
        "configurationIntro": {
            "introMessage": "To view your news at one stop you can configure all your key sources and aggregate them on Makenews.",
            "web": "Web",
            "facebook": "Facebook",
            "twitter": "Twitter",
            "getStarted": "Get Started"
        }
    }
};
