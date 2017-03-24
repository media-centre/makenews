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
            "getStarted": "get started for free",
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
        "configurePage": {
            "allCategories": {
                "allCategoriesHeading": "All Categories",
                "addNewCategoryLabel": "Add new category"
            },
            "categoryDetailsPage": {
                "allCategoriesLinkLabel": "All Categories",
                "deleteCategoryLinkLabel": "Delete Category",
                "addRSSUrlLinkLabel": "Add RSS feed URL",
                "addFacebookUrlLinkLabel": "Add Facebook public page URL",
                "addTwitterUrlLinkLabel": "Add Twitter Handle / Hash tag",
                "categoryDeletionConfirm": "will be deleted and you will no longer receive feeds from its URLs. Parked items will remain unaffected. Are you sure you want to continue?",
                "deleteURLConfirm": "You will no longer receive feeds from this URL. Parked items will remain unaffected. Are you sure you want to continue?",
                "hintMessages": {
                    "RSSHintMessage": "Please Enter RSS URL Here",
                    "FacebookHintMessage": "Please Enter Facebook URL Here",
                    "TwitterHintMessage": "Please Enter Twitter Handle Here",
                    "categoryTitle": "Invalid category name. Use only space or - or _"
                },
                "exampleMessages": {
                    "RSSExampleURL": "Example: http://www.thehindu.com/opinion/?service=rss",
                    "TwitterExampleURL": "Example: @the_hindu or #standwithjnu",
                    "FacebookExampleURL": "Example: https://www.facebook.com/thehindu"
                },
                "successMessages": {
                    "categoryDeleteSuccess": "is successfully deleted",
                    "categoryUpdated": "Category name is updated to",
                    "urlDeleteSuccess": "Feed URL successfully deleted",
                    "urlSuccess": "URL is successfully added"
                },
                "errorMessages": {
                    "emptyUrl": "URL cannot be empty",
                    "validatingUrl": "Validating the URL...",
                    "alreadyAdded": "URL is already added",
                    "invalidRssUrl": "Invalid RSS URL. Please check the URL",
                    "invalidTwitterUrl": "Invalid twitter handle or hashtag",
                    "noSuchTag": "No such hashtag or handle found",
                    "invalidFacebookUrl": "Invalid facebook URL. Please check the URL",
                    "noFbAccess": "No such link or no access to the profile",
                    "urlDeleteFailed": "URL deletion failed",
                    "categoryNameExists": "Category name already exists",
                    "categoryNameCantBeEmpty": "Category name can not be empty"
                }
            },
            "configureTabName": "Configure"
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
        "storyBoard": {
            "confirmDelete": "Are you sure you want to delete the story?"
        },
        "applicationTour": {
            "description": "Find HELP in the above options",
            "gotItText": "Got It"
        },
        "mainHeaderStrings": {
            "newsBoard": {
                "Name": "Scan News"
            },
            "storyBoard": {
                "Name": "Write a Story"
            },
            "configure": {
                "Name": "Configure"
            }
        },
        "confirmPopup": {
            "ok": "OK",
            "confirm": "CONFIRM",
            "cancel": "CANCEL"
        },
        "FAQs": [
            {
                "question": "What is the purpose of the application?",
                "answer": "To act as an aggregator for news items from different sources like RSS feeds, Facebook Page and Twitter Handles or Hashtags"
            }
        ]
    }
};
