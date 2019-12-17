/*eslint no-magic-numbers:0, no-console:0*/
"use strict"; //eslint-disable-line
function facebookRoutes(app) {
    app.get("/https://www.facebook.com/oauth/access_token", (request, response, next) => {
        console.log("/https://www.facebook.com/oauth/access_token request received");
        response.status(200);
        response.json({
            "access_token": "test token",
            "token_type": "bearer",
            "expires_in": 123456
        });
        next();
    });

    app.get("/https://www.facebook.com/search", (request, response, next) => {
        console.log("/https://www.facebook.com/search request received");

        const responseData = {
            "paging": {
                "cursors": {
                    "after": "enc_AdClDCor0"
                },
                "next": "https://graph.facebook.com/v2.8/search?fields=id,name,picture&type=page&q=The+Times+of+India&access_token=EAACQgZBvNveQ&offset=25&limit=25&__after_id=enc_AdClDCor0"
            },
            "data": [{
                "id": "26781952138",
                "name": "The Times of India",
                "picture": {
                    "data": {
                        "is_silhouette": false,
                        "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/14457373_10154629036722139_4431901373813970507_n.jpg?oh=6c51fabdc9f82578d5ed7b1ed4b353f0&oe=58DCB705"
                    }
                }
            }, {
                "id": "227797153941209",
                "name": "The Times of India | Entertainment",
                "picture": {
                    "data": {
                        "is_silhouette": false,
                        "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/c3.0.50.50/p50x50/1488150_587218951332359_2126798635_n.jpg?oh=ac0753459bc95d014997b1465bf9889c&oe=58E4EC54"
                    }
                }
            }]
        };

        response.status(200);
        response.json(responseData);
        next();
    });
}

module.exports = facebookRoutes;
