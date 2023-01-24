console.log(1)


// const baseUrl       = "http://localhost/shekhar/firebase/FirebaseApp/public/" 
const baseUrl       = "https://javascriptproject-3de28.web.app/" 
var default_Profile     = baseUrl + "dist/img/avatar5.png"


var firebaseConfig = {
    apiKey: "-",
    authDomain: "-",
    projectId: "-",
    storageBucket: "-",
    messagingSenderId: "-",
    appId: "-",
    databaseURL: "-",
    measurementId: "-"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();


function logout()
{
    firebase.auth().signOut().then(function() {
        console.log('Logged out sucessful.')
        window.location.href = baseUrl+"login"
      }).catch(function(error) {
        // An error happened.
      });
}

$(document).on('click', '.logoutEvent', function(){
    logout()
});


$(document).on('click', '#signInCustom', function(){
    var uname = $("#username").val();
    var upass = $("#password").val();
    console.log(uname, upass);
    var re          = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var checkemail  = re.test(uname)

    if(checkemail)
    {
        $("#username").removeClass('invalid_login');
        $("#password").removeClass('invalid_login');

        // console.log(uname, upass);
        firebase.auth().signInWithEmailAndPassword(uname, upass).catch(function(error) {

            if(error)
            {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage)
                $("#username").addClass('invalid_login');
                $("#password").addClass('invalid_login');
                toastr.error(errorMessage)
                // return false
            }
        }); 
        afterLogin()
       
    }
    else
    {
        $("#username").addClass('invalid_login');
        toastr.error('Please enter valid email')
    }
 
});

function afterLogin()
{
     firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("User logged in");
        window.location.href = baseUrl+"admin"
        
      } else {
          console.log("User logged out");
          // window.location.href = baseUrl+"login"
         }
    });
}
// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     console.log("User logged in");
//     // window.location.href = baseUrl+"admin"
    
//   } else {
//       console.log("User logged out");
//       // window.location.href = baseUrl+"login"
//      }
// });



$(document).on('click', '#googleSignIn', function(){
    if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // document.getElementById('quickstart-oauthtoken').textContent = token;
          afterLogin()
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
            // If you are using multiple auth providers on your app you should handle linking
            // the user's accounts here.
          } else {
            console.error(error.message);
            toastr.error(error.message)
          }
        });
      } else {
        firebase.auth().signOut();
      }
});


function getTimeStamp()
{
    var currentdate = new Date(); 
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/" 
        + currentdate.getFullYear() + " - "  
        + currentdate.getHours() + ":"  
        + currentdate.getMinutes() + ":" 
        + currentdate.getSeconds();

    // console.log(datetime);
    return datetime
}



var isValidAll = true;
var invalidCount = 0;

function validateme(thisObject, reqt) {
    var this_me = thisObject;
    var dataType = thisObject.attr('dataType');
    var dataName = thisObject.attr('name');
    var data = this_me.val();
    var reqType = reqt
    // isValidAll      =   true;


    this_me.removeClass('is-valid');
    this_me.removeClass('is-invalid');
    

    if (dataType == "text") {
        if (data !== null && data !== '') {
            this_me.addClass('is-valid');
            this_me.removeClass('is-invalid');
            // console.log(this_me.val(), dataType, reqType)
        } else {
            this_me.removeClass('is-valid');
            if (reqType == 'form') {
                this_me.addClass('is-invalid');
            }
            isValidAll = false
            invalidCount = invalidCount + 1
        }
    }

    if (dataType == "email") {
        var testEmail = /^(?:[A-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[A-z0-9](?:[A-z0-9-]*[A-z0-9])?\.)+[A-z0-9](?:[A-z0-9-]*[A-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[A-z0-9-]*[A-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
        if (data !== null && data !== '') {
            this_me.addClass('is-valid');
            this_me.removeClass('is-invalid');

            if (testEmail.test(data)) {
                // console.log(this_me.val(), dataType, reqType)
            } else {
                this_me.removeClass('is-valid');

                this_me.addClass('is-invalid');
                isValidAll = false
                invalidCount = invalidCount + 1
            }
        } else {
            this_me.removeClass('is-valid');
            if (reqType == 'form') {
                this_me.addClass('is-invalid');
            }
            isValidAll = false
            invalidCount = invalidCount + 1
        }
    }

    if (dataType == "phoneIndia") {
        var testEmail = /^\d{10}$/; 
        if (data !== null && data !== '') {
            this_me.addClass('is-valid');
            this_me.removeClass('is-invalid');

            if (testEmail.test(data)) {
                // console.log(this_me.val(), dataType, reqType)
            } else {
                this_me.removeClass('is-valid');

                this_me.addClass('is-invalid');
                isValidAll = false
                invalidCount = invalidCount + 1
            }
        } else {
            this_me.removeClass('is-valid');
            if (reqType == 'form') {
                this_me.addClass('is-invalid');
            }
            isValidAll = false
            invalidCount = invalidCount + 1
        }
    }


    if (dataType == "IndiaGST") {
        var testEmail = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/; 
        if (data !== null && data !== '') {
            this_me.addClass('is-valid');
            this_me.removeClass('is-invalid');

            if (testEmail.test(data)) {
                // console.log(this_me.val(), dataType, reqType)
            } else {
                this_me.removeClass('is-valid');

                this_me.addClass('is-invalid');
                isValidAll = false
                invalidCount = invalidCount + 1
            }
        } else {
            this_me.removeClass('is-valid');
            if (reqType == 'form') {
                this_me.addClass('is-invalid');
            }
            isValidAll = false
            invalidCount = invalidCount + 1
        }
    }

    if (dataType == "companyName") {
        var testEmail = /^[0-9A-Za-zÀ-ÿ\s,._+;()*~'#@!?&-]+$/; 
        if (data !== null && data !== '') {
            this_me.addClass('is-valid');
            this_me.removeClass('is-invalid');

            if (testEmail.test(data)) {
                // console.log(this_me.val(), dataType, reqType)
            } else {
                this_me.removeClass('is-valid');

                this_me.addClass('is-invalid');
                isValidAll = false
                invalidCount = invalidCount + 1
            }
        } else {
            this_me.removeClass('is-valid');
            if (reqType == 'form') {
                this_me.addClass('is-invalid');
            }
            isValidAll = false
            invalidCount = invalidCount + 1
        }
    }


    if (dataType == "number") {
        var testEmail = /^[0-9]*$/; 
        if (data !== null && data !== '') {
            this_me.addClass('is-valid');
            this_me.removeClass('is-invalid');

            if (testEmail.test(data)) {
                // console.log(this_me.val(), dataType, reqType)
            } else {
                this_me.removeClass('is-valid');

                this_me.addClass('is-invalid');
                isValidAll = false
                invalidCount = invalidCount + 1
            }
        } else {
            this_me.removeClass('is-valid');
            if (reqType == 'form') {
                this_me.addClass('is-invalid');
            }
            isValidAll = false
            invalidCount = invalidCount + 1
        }
    }


    if (dataType == "name") {
        var testEmail = /^[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßžØøÅåÆæœᗩɴńšȘčăğə]{1,}[a-zA-Z .'àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßžØøÅåÆæœᗩɴńšȘčăğə-]{1,}$/;
        if (data !== null && data !== '') {
            this_me.addClass('is-valid');
            this_me.removeClass('is-invalid');

            if (testEmail.test(data)) {
                // console.log(this_me.val(), dataType, reqType)
            } else {
                this_me.removeClass('is-valid');

                this_me.addClass('is-invalid');
                isValidAll = false
                invalidCount = invalidCount + 1
            }
        } else {
            this_me.removeClass('is-valid');
            if (reqType == 'form') {
                this_me.addClass('is-invalid');
            }
            isValidAll = false
            invalidCount = invalidCount + 1
        }
    }


    if (dataType == "date") {

        if (data !== null && data !== '') {
            this_me.addClass('is-valid');
            this_me.removeClass('is-invalid');
            this_me.removeClass('error_m1');
            this_me.removeClass('error_m2');

            if (moment(data, 'DD/MM/YYYY', true).isValid()) {
                // console.log(this_me.val(), dataType, reqType)
            } else {
                this_me.removeClass('is-valid');

                this_me.addClass('is-invalid');
                isValidAll = false
                invalidCount = invalidCount + 1

            }
        } else {
            this_me.removeClass('is-valid');
            if (reqType == 'form') {
                this_me.addClass('is-invalid');
            }
            isValidAll = false
            invalidCount = invalidCount + 1
        }
    }

    if (dataType == "select") {
        if (data !== null && data !== '') {
            this_me.addClass('is-valid');
            this_me.removeClass('is-invalid');
            // console.log(this_me.val(), dataType, reqType)
        } else {
            this_me.removeClass('is-valid');
            if (reqType == 'form') {
                this_me.addClass('is-invalid');
            }

            isValidAll = false
            invalidCount = invalidCount + 1

        }
    }


    if (dataType == "checkbox") {

        // console.log(dataName)
        if ($('[name=' + dataName + ']:checked').length > 0) {
            this_me.parents('.checkbox_parent_1').addClass('is-valid');
            this_me.parents('.checkbox_parent_1').removeClass('is-invalid');
            // console.log(this_me.val(), dataType, reqType)
        } else {
            this_me.parents('.checkbox_parent_1').removeClass('is-valid');
            if (reqType == 'form') {
                this_me.parents('.checkbox_parent_1').addClass('is-invalid');
            }

            isValidAll = false
            invalidCount = invalidCount + 1
        }
    }


    if (dataType == "radio") {

        // console.log(dataName)
        if ($('[name=' + dataName + ']:checked').length > 0) {
            this_me.parents('.checkbox_parent_1').addClass('is-valid');
            this_me.parents('.checkbox_parent_1').removeClass('is-invalid');
            // console.log(this_me.val(), dataType, reqType)
        } else {
            this_me.parents('.checkbox_parent_1').removeClass('is-valid');
            if (reqType == 'form') {
                this_me.parents('.checkbox_parent_1').addClass('is-invalid');
            }

            isValidAll = false
            invalidCount = invalidCount + 1
        }
    }


    if (dataType == "zip") {
        var testEmail = /^\d{5}([ \-]\d{4})?$/;
        
        if (data !== null && data !== '') {
            this_me.addClass('is-valid');
            this_me.removeClass('is-invalid');

            if (testEmail.test(data)) {
                // console.log(this_me.val(), dataType, reqType)
            } else {
                this_me.removeClass('is-valid');

                this_me.addClass('is-invalid');
                isValidAll = false
                invalidCount = invalidCount + 1
            }
        } else {
            this_me.removeClass('is-valid');
            if (reqType == 'form') {
                this_me.addClass('is-invalid');
            }
            isValidAll = false
            invalidCount = invalidCount + 1
        }
    }


    if (dataType == "partnercode") {
        if(data == "")
        {
          // this_me.addClass('is-valid');
          // this_me.removeClass('is-invalid');
          // this_me.removeClass('error_m1');
          // this_me.removeClass('error_m2');
        }
        else
        {
          // console.log('0000000000000000')
        }
    }
}

$(".required").change(function() {
    validateme($(this), 'self')
});




async function uploadImage(inpId, nextPath) {
  const ref = firebase.storage().ref('/images/'+nextPath);
  const file = document.querySelector("#"+inpId).files[0];
  const name = +new Date() + "-" + file.name;
  const metadata = {
    contentType: file.type
  };
  const newUrl = await ref.child(name).put(file, metadata).then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
      // console.log(url);
      // document.querySelector("#image").src = url;
      return url
    })
    .catch(console.error);

    // console.log(task)
    return newUrl
}





// function chnageRootMain(componentType)
// {
//     if(componentType == "login")
//     {
//        $("#rood_d").empty();
//        $.get("components/login/index.html", function (data) {
//        $("#rood_d").append(data);
//         });
//     } else if(componentType == "dash")
//     {
//        $("#rood_d").empty();
//        $.get("components/dash/index.html", function (data) {
//        $("#rood_d").append(data);
//         });
//     } else
//     {
//        $("#rood_d").empty();
//        $.get("components/home/index.html", function (data) {
//        $("#rood_d").append(data);
//         });
//     }  
// }



// function changeurl(url, title) {
       
//     var new_url = '/' + url;
//     window.history.pushState('data', title, new_url);
    

//     // basicCalls()
// }

// $(document).on('click', '.logoutEvent', function(){
//        logout()
// });

// let urlPath
// $(window).on('load', function(){

       
//        basicCalls()
// });

// function basicCalls() {

//        console.log(1)
//        urlPath       = window.location.pathname
//        if(urlPath.includes("/dash"))
//        {
//               // console.log(1)
//               
//        }
//        else if(urlPath == "/login")
//        {
//               chnageRootMain("login");
//               changeurl("login", "login")
//        }
//        else{
//               chnageRootMain("home");
//               changeurl("", "home")
//        }
// }



// $(document).on('click', 'a', function(e){
//      e.preventDefault();
//      e.stopImmediatePropagation();

//      let path        = $(this).attr('href');
//      console.log(path)
//      var rPath = path.substring(1);
//      changeurl(rPath, rPath)
//      // chnageRootMain(rPath)
//      // basicCalls()
//      return false;
// });

// var currentPage = location.href;
 
// setInterval(function()
// {
//     if (currentPage != location.href)
//     {
//         // page has changed, set new page as 'current'
//         currentPage = location.href;
       
//        basicCalls()
//     }
// }, 200);