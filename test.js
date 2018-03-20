// 'use strict';
 var spawn = require('child_process').spawn;

 var args = [ 'bac\\(', 'c:\\desenv\\projects\\atlas\\client' ];
 var argsString = 'rg bac\\( c:\\desenv\\projects\\atlas\\client';

//var runRipGrep= exec('rg', args.join(" "));

//runRipGrep.stdout.setEncoding("UTF-8");

// runRipGrep.stdout.on('data', data => {
//     console.log(data)
// });

// runRipGrep.on('close', code => {
//     console.log(code);
// });

var exec = require('child_process').exec;
exec(argsString, function (err, stdout, stderr) {
    console.log(stdout);
});



var argsString = './rg.exe bac\\( c:\\desenv\\projects\\atlas\\client';
        var exec = require('child_process').exec;
        exec(argsString, function (err, stdout, stderr) {
            console.log(err);
            console.log(stdout);
            console.log(stderr);
        });


// var ls = spawn( 'rg', args );

// ls.stdout.on( 'data', data => {
//     console.log( `stdout: ${data}` );
// } );

// ls.stderr.on( 'data', data => {
//     console.log( `stderr: ${data}` );
// } );

// ls.on( 'close', code => {
//     if(code == 0)
//     console.log( `sucesso` );
// } );