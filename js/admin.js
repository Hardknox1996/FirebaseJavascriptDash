let userDetails;
let defaultDetails
var setCompanyName      = "companies";
var setRecordTable      = "allRecords";

// var bigOne    = document.getElementById('BigOne')
// Web Soket
var dbRef     = firebase.database().ref().child('text');
dbRef.on('value', snap =>{
    let getVal = snap.val()
    // console.log(getVal)
});



// var database = firebase.database();

// var starCountRef = firebase.database().ref();
// starCountRef.on('text', (snapshot) => {
//   const data = snapshot.val();

//   console.log(data)
//   // updateStarCount(postElement, data);
// });



firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("User logged in");
    // window.location.href = baseUrl+"admin"
    userDetails = user
    defaultDetails = user


    var docRef = db.collection("admins").doc(user.email);
    docRef.get().then((doc) => {
    if (doc.exists) {
        // console.log(doc.data());
    
        userDetails = doc.data()
        afrerCheckUeser()

    } else {
        console.log("No such document!" , user.email);
        console.log(defaultDetails.displayName || "User", photoURL || default_Profile, emailVerified, user.email)
        docRef.set({
            displayName: defaultDetails.displayName || "User",
            photoURL: photoURL || default_Profile,
            emailVerified: emailVerified || 'false',
            userEmail: user.email
        })
        .then(() => {

            toastr.success('Profile Updated')
            afrerCheckUeser()
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });


        // afrerCheckUeser()
    }
    }).catch((error) => {
    console.log("Error getting document:", error);
    });
    // afrerCheckUeser()
    
  } else {
      console.log("User logged out");
      window.location.href = baseUrl+"login"
     }
});



function resetUserWeb()
{
    var docRef = db.collection("admins").doc(userEmail);
    docRef.get().then((doc) => {
    if (doc.exists) {
        console.log(doc.data());
    
        userDetails = doc.data()
        console.log(userDetails)
        afrerCheckUeser()

    } else {

        console.log("No such document!");
        afrerCheckUeser()
    }
    }).catch((error) => {
    console.log("Error getting document:", error);
    });
}

var userEmail
var fullName
var emailVerified
var photoURL
var userAddress 

async function afrerCheckUeser()
{
    // console.log(userDetails)
    if(userDetails)
    {
        userEmail               = userDetails.userEmail || defaultDetails.email 
        fullName                = userDetails.displayName || "User"
        emailVerified           = userDetails.emailVerified
        photoURL                = userDetails.photoURL  || default_Profile
        phoneNumber             = userDetails.phoneNumber
        userAddress             = userDetails.userAddress || ""

        // console.log(userEmail, fullName, emailVerified, phoneNumber , photoURL, userAddress)

        // set all detail on load

        $(".userPhotoURL").attr('src', photoURL)
        $(".userFullName").empty().text(fullName)
        $(".userFullEmail").empty().text(userEmail)
        $(".userFullPhone").empty().text(phoneNumber)
        $(".userFullAddress").empty().text(userAddress)

        // profilesection
        $("#fullName").val(fullName);
        $(".userEmailInp").val(userEmail);
        $("#phoneNumber").val(phoneNumber)

        $('#userAddress').val(userAddress);

        $("#loading-spinner").fadeOut();
    }
}


// Edit Profile Section JS

if($('[data-mask]').length)
$('[data-mask]').inputmask();

$(document).on('click', '#preofilePreview', function(){
    
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    async function Main2() {
       const file = document.querySelector('#exampleInputFile').files[0];
       var b64Preview = await toBase64(file)
       await $(".profile-user-img").attr("src", b64Preview);
    }
    Main2();
});

// Validation
$(document).on('click', '#submit_profile', async function(){
    isValidAll = true
    var getFormId = await $(this).attr("formId");
    console.log('#'+getFormId+' .required')
    await $('#'+getFormId).find('.required').each(function(idx, field) {
        validateme($(this), 'form')
    });
    
    if (isValidAll) {
        console.log('Ready to Submit')
        $(".ajaxLoading").addClass("active");
        $('#'+getFormId).parents('.card').append('<div class="overlay '+getFormId+' "><i class="fas fa-2x fa-sync-alt fa-spin"></i></div>');

        var profileUrl;
        var fullName    = $("#fullName").val();
        var phone       = $("#phoneNumber").val();
        var address


        if($("#exampleInputFile").val()!="")
        {
            profileUrl =  await uploadImage("exampleInputFile", "profiles")
            photoURL    = profileUrl
            $("#exampleInputFile").val("")
        }
        
        if($("#userAddress").val()!="")
        {
            address = $("#userAddress").val()
        }
        

        


        console.log(userEmail)
        await db.collection("admins").doc(userEmail).set({
            displayName: fullName,
            photoURL: photoURL || photoURL,
            phoneNumber: phone,
            emailVerified: emailVerified,
            userEmail: userEmail,
            userAddress: address || ""
        })
        .then(() => {
            console.log(fullName, phone, photoURL)
            $(".ajaxLoading").removeClass("active");
            $('.'+getFormId).remove();

            toastr.success('Profile Updated')
            resetUserWeb()
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
        
    }
});




// Massanger Section

$(document).ready(setResoultionCal);
$(window).on('resize',setResoultionCal);

function setResoultionCal() {
    // $(".content-wrapper").height();
    var getSectionH     = Math.round($(".content-wrapper").height())
    var setChatH        = getSectionH - 180;
    $(".set_chat_h").css("height", setChatH+"px")
}










// Add Company Section
$(document).on('click', '#addCompanyData', async function(){
    isValidAll = true
    var getFormId = await $(this).attr("formId");
    console.log('#'+getFormId+' .required')
    await $('#'+getFormId).find('.required').each(function(idx, field) {
        validateme($(this), 'form')
    });
    
    if (isValidAll) {
        // console.log('Ready to Submit')
        $(".ajaxLoading").addClass("active");
        $('#'+getFormId).parents('.card').append('<div class="overlay '+getFormId+' "><i class="fas fa-2x fa-sync-alt fa-spin"></i></div>');

        var companyName         = $("#addCompanyName").val()
        var companyGST          = $("#addCompanyGTS").val()
        var totalData

        
        var setId;
        var setTimeStamp        = getTimeStamp()

        var gstInt2             = companyGST.substring(0,2) 
        
        var integratedFlag      = false 
        if (gstInt2 != "27")
        {
            integratedFlag = true
        }

        

        var countVF = db.collection("compCount").doc('count');
        await countVF.get().then((doc) => {
            var getdata1        = doc.data()
            console.log(getdata1.count)
            totalData           = parseInt(getdata1.count + 1)
            setId               = "SAP"+totalData;
        });

        await countVF.set({count: totalData})
        .then(() => {
            
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });



        console.log(setId, companyName, companyGST, userEmail, setTimeStamp, integratedFlag )

        await db.collection(setCompanyName).doc(setId).set({
            companyName: companyName,
            companyGST: companyGST,
            timeStamp: setTimeStamp,
            createdBy: userEmail,
            compId: setId,
            integratedFlag: integratedFlag

        })
        .then(() => {
            
            $(".ajaxLoading").removeClass("active");
            $('.'+getFormId).remove();

           $('#'+getFormId+" :input").val('');

            toastr.success('Company Addded');
            refreshCompanyList()
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
        
    }
});
var dataTable1 
$( document ).ready(async function() {

    dataTable1 = $('#listOfComp').DataTable({
      "responsive": true,
      "autoWidth": false,
    });
    await refreshCompanyList()
    

});


async function refreshCompanyList(){

    
    dataTable1.clear()
    await db.collection(setCompanyName)
    .get()
    .then(querySnapshot => {
    const documents = querySnapshot.docs.map(doc => doc.data())
    // do something with documents
    // $("#listOfComp tbody").empty();
    for(var i=0; i < documents.length; i++)
    {
        // console.log(documents[i])
        // let htmlStructure = " <tr><td>"+documents[i].companyName+"</td><td>"+documents[i].companyGST+"</td></tr>"
        // console.log(htmlStructure)
        var setData = "<span id="+documents[i].compId+">"+documents[i].companyGST+"</span>"
        var removeRow = "<span ><button type='button' class='btn btn-danger btn-sm remove_comp_d'id="+documents[i].compId+" compName="+documents[i].companyName+"><i class='fas fa-trash'></i></button></span>"
        dataTable1.row.add([documents[i].companyName,setData, removeRow]);

        // $("#listOfComp tbody").append(htmlStructure)
    }
    dataTable1.draw();
    }) 
}

$(document).on('click', '.remove_comp_d', async function(){
    var getCompId       = $(this).attr("id");
    var comName         = $(this).attr("compName");
    $(".removeConfirmCta").attr("removeComp",getCompId)
    $(".compN").text(comName);
    $(".removeConfirmCta").removeAttr("disabled");
    $(".set_lb_comp_remove").addClass('active');
});

$(document).on('click', '.removeConfirmCta', async function(){

    $(this).attr("disabled", true);
    var removeConfId       = $(this).attr("removeComp");
    console.log(removeConfId)
    
    await db.collection(setCompanyName).doc(removeConfId).delete().then(() => {
        $(".set_lb_comp_remove").removeClass('active');
        // console.log("Document successfully deleted!");
        toastr.success('Company Removed');
        $(".removeConfirmCta").removeAttr("disabled");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });

    refreshCompanyList()

});
$(document).on('click', '.close_removeComp', async function(){

    $(".set_lb_comp_remove").removeClass('active');
});







// Add Data Section

    // Default Vaidables
    var invAutoIdFinal;
    var gstNumFinal;
    var compIdFinal;
    var comNameFinal;
    var invIdFinal;
    var invDateFinal;

    var precentField_0     =  ""
    var precentField_5     =  ""
    var precentField_12    =  ""
    var precentField_18    =  ""

    var GrandTotalFinal    = 0


$( document ).ready(async function() {
    await getAllComForRec()
    $('.select2').select2()

    $('#datemask').inputmask('dd/mm/yyyy', { 'placeholder': 'dd/mm/yyyy' })
});


async function getAllComForRec()
{
    $(".select2").empty()
    await db.collection(setCompanyName)
    .get()
    .then(querySnapshot => {
    const documents = querySnapshot.docs.map(doc => doc.data())
    // do something with documents
    // $("#listOfComp tbody").empty();
    $(".select2").append("<option selected value=''>Select Company</option>")
    for(var i=0; i < documents.length; i++)
    {
        $(".select2").append("<option value="+documents[i].compId+">"+documents[i].companyName+"</option>")
        // console.log(documents[i])
    }
    })
    $('.select2').select2()
}

$(document).on('change', '.select2', async function(){
    // console.log($(this).val())
    var compId      = $(this).val()
    if(compId!="")
    {
        var docRef = db.collection(setCompanyName).doc(compId);

        docRef.get().then((doc) => {
        var getData        = doc.data();
        $("#gstPrintHere").val(getData.companyGST)
        
        comNameFinal        = getData.companyName
        gstNumFinal         = getData.companyGST
        compIdFinal         = compId
        validateme($("#gstPrintHere"), 'self')

        }).catch((error) => {
            console.log("Error getting document:", error);
            
        comNameFinal        = ""
        gstNumFinal         = ""
        compIdFinal         = ""

        });

    }
    else
    {
        $("#gstPrintHere").val("")
        validateme($("#gstPrintHere"), 'self')

        comNameFinal        = ""
        gstNumFinal         = ""
        compIdFinal         = ""
    }

    
});





$(document).on('change', '.cal_tax_amt', async function(){
    // console.log($(this).val())
     
    var tax_wT      = $(this).val()
    var getId       = $(this).attr("refId");
    var getinpId       = $(this).attr("inp_id");
    $("#"+getId).text("0")
    $("#"+getinpId).val("0")   
    if(tax_wT!="")
    {
        $(this).addClass("required");
        var testEmail = /^[0-9]*$/; 
        if (testEmail.test(tax_wT)) {
            
            var getPerct = $(this).attr("getPerc");
            
            var calPerct = (tax_wT * (1 + getPerct/100)).toFixed(2)

            // console.log(calPerct)
            $("#"+getId).text(calPerct)
            $("#"+getinpId).val(calPerct)

        } else {

        }

    }
    else
    {
        $(this).removeClass("required");
        $(this).removeClass("is-valid");
        $(this).removeClass("is-invalid");
    }

    validateme($(this), 'self')
    calAllFianlAmt()
});






async function calAllFianlAmt()
{
    let amt1    = parseFloat($("#calh1").val()) ||  0;
    let amt2    = parseFloat($("#calh2").val()) ||  0;
    let amt3    = parseFloat($("#calh3").val()) ||  0;
    let amt4    = parseFloat($("#calh4").val()) ||  0;
    console.log("----------------------------------")
    console.log(amt1 , amt2 , amt3 , amt4)
    var grandTotal = (amt1 + amt2 +amt3 + amt4).toFixed(2)
    console.log(grandTotal);
    $(".invTotal").text(grandTotal)
    $(".grandT").text(Math.round(grandTotal))

    precentField_0 = amt1
    precentField_5 = amt2
    precentField_12 = amt3
    precentField_18 = amt4

    GrandTotalFinal = Math.round(grandTotal)
} 






$(document).on('click', '#addInvData', async function(){
    isValidAll = true
    var getFormId = await $(this).attr("formId");
    console.log('#'+getFormId+' .required')
    await $('#'+getFormId).find('.required').each(function(idx, field) {
        validateme($(this), 'form')
    });
    
    if (isValidAll) {
        // console.log('Ready to Submit')
        


        
        

        invIdFinal          = $("#invoiceNumber").val()
        invDateFinal        = $("#invDate").val()

        
        if(GrandTotalFinal == 0)
        {
            $(".cal_tax_amt").addClass("is-invalid");
        }
        else
        {


            $(".ajaxLoading").addClass("active");
            $('#'+getFormId).parents('.card').append('<div class="overlay '+getFormId+' "><i class="fas fa-2x fa-sync-alt fa-spin"></i></div>');
            $(".cal_tax_amt").removeClass("is-invalid");

            console.log("Ready to submit");


            var countVF = db.collection("compCount").doc('recordCount');
            await countVF.get().then((doc) => {
                var getdata1        = doc.data()
                console.log(getdata1.count)
                totalData           = parseInt(getdata1.count + 1)
                invAutoIdFinal      = "ID_"+totalData;
            });
            await countVF.set({count: totalData})
            .then(() => {
                
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
            var setTimeStamp        = getTimeStamp()

            console.log(invAutoIdFinal,gstNumFinal,compIdFinal,comNameFinal,invIdFinal,invDateFinal,precentField_0,precentField_5,precentField_12,precentField_18,GrandTotalFinal);


            await db.collection(setRecordTable).doc(invAutoIdFinal).set({
                ROW_ID:invAutoIdFinal,
                CompanyName: comNameFinal,
                ComPanyId: compIdFinal,
                GSTNumber:gstNumFinal,
                InvoiceID: invIdFinal,
                InvoiceDate: invDateFinal,
                Percentage_0: precentField_0,
                Percentage_5: precentField_5,
                Percentage_12: precentField_12,
                Percentage_18: precentField_18,
                GrandTotal: GrandTotalFinal,
                createdBy: userEmail,
                setTimeStamp: setTimeStamp


            })
            .then(() => {

            $(".ajaxLoading").removeClass("active");
            $('.'+getFormId).remove();

               $("#invoiceNumber").val('');
               $(".cal_tax_amt").val('');
               $(".cal_tax_amt").removeClass('required').removeClass('is-valid');
               $("#invoiceNumber").removeClass('is-valid');
               calAllFianlAmt()

                toastr.success('Data Added Addded '+ invAutoIdFinal);
                $(".cal_tax_amt").change();
                refreshCompanyList()
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        }

    }
});













// Show All Records
var dataTable2 
$( document ).ready(async function() {

    dataTable2 = $('#listOfRecords').DataTable({
      "responsive": true,
      "autoWidth": false,
    });
    await refreshAllRecordList()
    

});


async function refreshAllRecordList(){

    dataTable2.clear()
    await db.collection(setRecordTable)
    .get()
    .then(querySnapshot => {
    const documents = querySnapshot.docs.map(doc => doc.data())
    // do something with documents
    // $("#listOfComp tbody").empty();
    for(var i=0; i < documents.length; i++)
    {
        // console.log(documents[i])
        // let htmlStructure = " <tr><td>"+documents[i].companyName+"</td><td>"+documents[i].companyGST+"</td></tr>"
        // console.log(htmlStructure)
        // var setData = "<span id="+documents[i].compId+">"+documents[i].companyGST+"</span>"
        // var removeRow = "<span ><button type='button' class='btn btn-danger btn-sm remove_comp_d'id="+documents[i].compId+" compName="+documents[i].companyName+"><i class='fas fa-trash'></i></button></span>"
        

        var TableId             = "<td>"+documents[i].ROW_ID+"</td>"
        var InvoiceId           = "<td>"+documents[i].InvoiceID+"</td>"
        var CompName            = "<td>"+documents[i].CompanyName+"</td>"
        var GstNumTab           = "<td>"+documents[i].GSTNumber+"</td>"
        var perce0              = "<td>₹"+documents[i].Percentage_0+"</td>"
        var perce5              = "<td>₹"+documents[i].Percentage_5+"</td>"
        var perce12             = "<td>₹"+documents[i].Percentage_12+"</td>"
        var perce18             = "<td>₹"+documents[i].Percentage_18+"</td>"
        var grandTotalTb        = "<td>₹"+documents[i].GrandTotal+"</td>"
        var InvoiceDate         = "<td>"+documents[i].InvoiceDate+"</td>"
        var CreationDate        = "<td>"+documents[i].setTimeStamp+"</td>"
        var deletRow            = "<td><span><button type='button' class='btn btn-danger btn-sm remove_row_d' id="+documents[i].ROW_ID+" compname="+documents[i].InvoiceID+"><i class='fas fa-trash'></i></button></span></td>"

        dataTable2.row.add([TableId,InvoiceId,CompName,GstNumTab,perce0,perce5,perce12,perce18,grandTotalTb,InvoiceDate, deletRow]);

        // $("#listOfComp tbody").append(htmlStructure)
    }
    dataTable2.draw();
    }) 
}

$(document).on('click', '.remove_row_d', async function(){
    var getCompId       = $(this).attr("id");
    var comName         = $(this).attr("compName");
    $(".removeConfirmCta_data").attr("removeComp",getCompId)
    $(".compN").text(comName);
    $(".removeConfirmCta_data").removeAttr("disabled");
    $(".set_lb_comp_remove").addClass('active');
});

$(document).on('click', '.removeConfirmCta_data', async function(){

    $(this).attr("disabled", true);
    var removeConfId       = $(this).attr("removeComp");
    console.log(removeConfId)
    
    await db.collection(setRecordTable).doc(removeConfId).delete().then(() => {
        $(".set_lb_comp_remove").removeClass('active');
        // console.log("Document successfully deleted!");
        toastr.success('Data Removed');
        $(".removeConfirmCta_data").removeAttr("disabled");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });

    refreshAllRecordList()

});
$(document).on('click', '.refresh_data_all_row', async function(){

    refreshAllRecordList()

});










// Export Excel Section

var exportTable 
$( document ).ready(async function() {

    exportTable = $('#listOfRecordsExport').DataTable({
        "responsive": true,
        "autoWidth": false,
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'copyHtml5',
                title:  'Data Export'
            },

            {
                extend: 'excelHtml5',
                title:  'Data Export'
            },

            {
                extend: 'csvHtml5',
                title:  'Data Export'
            },

            {
                extend: 'pdfHtml5',
                title:  'Data Export'
            },

        ]
    });
    await refreshAllRecordListExport()
    

});


async function refreshAllRecordListExport(){

    exportTable.clear()
    await db.collection(setRecordTable)
    .get()
    .then(querySnapshot => {
    const documents = querySnapshot.docs.map(doc => doc.data())
    // do something with documents
    // $("#listOfComp tbody").empty();
    for(var i=0; i < documents.length; i++)
    {
        // console.log(documents[i])
        // let htmlStructure = " <tr><td>"+documents[i].companyName+"</td><td>"+documents[i].companyGST+"</td></tr>"
        // console.log(htmlStructure)
        // var setData = "<span id="+documents[i].compId+">"+documents[i].companyGST+"</span>"
        // var removeRow = "<span ><button type='button' class='btn btn-danger btn-sm remove_comp_d'id="+documents[i].compId+" compName="+documents[i].companyName+"><i class='fas fa-trash'></i></button></span>"
        

        var TableId             = "<td>"+i+"</td>"
        var InvoiceId           = "<td>"+documents[i].InvoiceID+"</td>"
        var CompName            = "<td>"+documents[i].CompanyName+"</td>"
        var GstNumTab           = "<td>"+documents[i].GSTNumber+"</td>"
        var perce0              = "<td>₹"+documents[i].Percentage_0+"</td>"
        var perce5              = "<td>₹"+documents[i].Percentage_5+"</td>"
        var perce12             = "<td>₹"+documents[i].Percentage_12+"</td>"
        var perce18             = "<td>₹"+documents[i].Percentage_18+"</td>"
        var grandTotalTb        = "<td>₹"+documents[i].GrandTotal+"</td>"
        var InvoiceDate         = "<td>"+documents[i].InvoiceDate+"</td>"
        var CreationDate        = "<td>"+documents[i].setTimeStamp+"</td>"
        // var deletRow            = "<td><span><button type='button' class='btn btn-danger btn-sm remove_row_d' id="+documents[i].ROW_ID+" compname="+documents[i].InvoiceID+"><i class='fas fa-trash'></i></button></span></td>"

        exportTable.row.add([TableId,InvoiceId,CompName,GstNumTab,perce0,perce5,perce12,perce18,grandTotalTb,InvoiceDate]);

        // $("#listOfComp tbody").append(htmlStructure)
    }
    exportTable.draw();
    }) 
}