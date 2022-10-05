import { Handler } from "@netlify/functions";
import axios from 'axios';

// Login to Kickbase => Token
function  login(): String {
        axios({
            'url': 'https://api.kickbase.com/user/login',
            "method": 'POST',
            'data': {
                'email': 'pro',
                'password': localStorage.getItem('password'),
                'ext': true,
            }
              })
            .then((response) => {
                if (response.status === 200) {

                    if (response.data.token && response.data.tokenExp) {
                        localStorage.setItem('token', response.data.token)
                        localStorage.setItem('tokenExp', response.data.tokenExp)
                    } else {
                    }
                }
            })
            .catch(function () {
            })
    }

function getToken():  String {
    return 'Bearer ' + localStorage.getItem('token');
} 
    
function checkForCredentials(): Boolean {
        if (localStorage.getItem('user') &&
            localStorage.getItem('password') &&
            localStorage.getItem('user') !== "" &&
            localStorage.getItem('password') !== ""
        ) {
            return true;
        }
        return false;
    }

// Get all players with market values and offers

// calculate too low offers

// every hour: put all player without offer on market

// every hour: remove player with too low offer from market

//axios.defaults.headers.common['Authorization'] = api.getToken();



const handler: Handler = async (event, context) => {
    console.log("Received event:", event)

    return {
        statusCode: 200,
    };
};

export { handler };

