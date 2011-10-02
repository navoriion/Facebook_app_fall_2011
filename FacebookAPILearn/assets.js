//Copyright 2009 BlurbIQ, Inc. 

function loadForm(obj, fields) 
{ 
    var newdiv = document.getElementById('bi:form:div');
    var newdesc = document.createElement('div');
    newdesc.innerHTML = fields.desc;
    newdiv.appendChild(newdesc);
    var returns = document.createElement('pre');
    returns.innerHTML = 'Returns: ' + fields.retData;
    newdiv.appendChild(returns);
    var newform = document.createElement('form');
    newform.onsubmit = function() 
        {
            try 
            { 
                submitForm(this);
            } catch(err) 
            { 
                alert(err); 
            } 
            return false;
        }; 
        
    newdiv.appendChild(newform);
    newform.appendChild(addfields(fields.valid, '')); 
    
    var newsubmit = document.createElement('input');
    newsubmit.type = 'submit';
    newform.appendChild(newsubmit); 
    return true; 
} 

function addfields(fields, prefix) 
{ 
    var newdiv = document.createElement('div');
    newdiv.style.marginLeft = '15px';
    for(var i in fields) 
    { 
        newfield(fields[i], prefix, newdiv, 0);
    } 
    return newdiv; 
} 

function asdf(a, b, c, d, aaa) 
{ 
    newfield(a, b, c, d, aaa); 
} 

function newfield(f, prefix, append, index, aaa) 
{ 
    var newdiv = document.createElement('div');
    newdiv.innerHTML = f.name + ' - ';
    var fname = f.name;
    if(f.array) 
    { 
        fname += '[' + index + ']';
        if(index == 0) 
        { 
            var hiddenfield = document.createElement('input');
            hiddenfield.type = 'hidden';
            hiddenfield.name = prefix + f.name;
            hiddenfield.id = prefix + f.name;
            hiddenfield.value = 'array';
            newdiv.appendChild(hiddenfield);
        } 
        var adddeldiv = document.createElement('span');
        newdiv.appendChild(adddeldiv);
        var adiv = document.createElement('a');
        adiv.innerHTML = 'Add';
        adiv.href = '#';
        adiv.onclick = function() 
            { 
                asdf(f, prefix, newdiv, index + 1, adddeldiv);
                adddeldiv.style.display = 'none';
            };
        
        adddeldiv.appendChild(adiv); 
        adddeldiv.innerHTML += ' '; 
        
        if(index > 0)
        { 
            var sdiv = document.createElement('span');
            sdiv.innerHTML = ' ';
            adddeldiv.appendChild(sdiv);
            var ddiv = document.createElement('a');
            ddiv.innerHTML = 'Delete';
            ddiv.href = '#';
            ddiv.onclick = function() 
                { 
                    newdiv.innerHTML = '';
                    aaa.style.display = '';
                }; 
            
            adddeldiv.appendChild(ddiv);
        } 
        
        var zdiv = document.createElement('span'); zdiv.innerHTML = ' - '; adddeldiv.appendChild(zdiv); } if(f.type == 'subhash') { var hiddenfield = document.createElement('input'); hiddenfield.type = 'hidden'; hiddenfield.name = prefix + fname; hiddenfield.id = prefix + fname; hiddenfield.value = 'hash'; newdiv.appendChild(hiddenfield); } else { var newfield = document.createElement('input'); newfield.type = 'text'; newfield.name = prefix + fname; newfield.id = prefix + fname; newdiv.appendChild(newfield); if(fname == 'access_token') { var newbutton = document.createElement('button'); newbutton.innerHTML = 'Login to facebook'; newbutton.onclick = function() { fblogin(newfield); return false; }; newdiv.appendChild(newbutton); } } var newfielddesc = document.createElement('span'); newfielddesc.innerHTML += f.desc; newfielddesc.innerHTML += ' - (' + f.valid + ')'; newdiv.appendChild(newfielddesc); if(f.type == 'subhash') { newdiv.appendChild(addfields(f.subhash, fname + '.')); } append.appendChild(newdiv); } function submitForm(obj) { var data = {}; for(var i = 0; i < obj.elements.length; i++) { var f = obj.elements[i]; if(f.type == 'hidden' && f.value == 'array') { eval('data.' + f.name + ' = new Array()'); } else if(f.type == 'hidden' && f.value == 'hash') { eval('data.' + f.name + ' = new Object()'); } else if(f.type != 'submit' && f.value != '') { try { var js = JSON.parse(f.value); eval('data.' + f.name + ' = ' + f.value); } catch(err) { eval('data.' + f.name + ' = f.value'); } } } var output = document.getElementById('bi:output:div'); output.innerHTML = 'Loading...'; $.ajax({ type: 'POST', url: document.location.href, contentType: 'application/json', processData: false, data: JSON.stringify(data), dataType: 'json', error: function(msg) { output.innerHTML = '
        }
    }
' + $('').text(JSON.stringify(msg, null, 1)).html() + ''; }, success: function(msg) { switch(msg.status) { case 0: output.innerHTML = '' + $('').text(JSON.stringify(msg, null, 1)).html() + ''; break; case 1: output.innerHTML = '
Unknown Method '; break; case 2: output.innerHTML = '
Not Authenticated '; break; case 3: output.innerHTML = '
Data Validation Error - '; output.innerHTML += '' + $('').text(JSON.stringify(msg, null, 1)).html() + ''; break; default: output.innerHTML = '
Unknown status response '; output.innerHTML += '' + $('').text(JSON.stringify(msg, null, 1)).html() + ''; } } }); } //Facebook authentication functions function fblogin(newfield) { FB.login(function(response) { if(response.session) { document.getElementById('
bi: output: div ').innerHTML = '' + JSON.stringify(response, null, 1) + ''; if(newfield) { newfield.value = response.session.access_token; } } else { alert('
Login Failed '); } }, {perms: '
email,
user_likes,
user_birthday,
user_location,
user_religion_politics,
user_relationships '}); } window.fbAsyncInit = function() { if(fb_app_id) { FB.init({appId: fb_app_id, status: true, cookie: true, xfbml: true}); } }; (function() { var e = document.createElement('
script '); e.type = '
text / javascript '; e.src = document.location.protocol + ' //connect.facebook.net/en_US/all.js'; e.async = true; document.getElementById('fb-root').appendChild(e); }());