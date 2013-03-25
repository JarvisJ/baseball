function GetGradientArray(fromHexColor, toHexColor, steps) {
 //ByVal fromHexColor As String, ByVal toHexColor As String, ByVal steps As Integer
        var fromR  = parseInt(fromHexColor.substr(0, 2), 16) ;
        var fromG  = parseInt(fromHexColor.substr(2, 2), 16) ;
        var fromB  = parseInt(fromHexColor.substr(4, 2), 16) ;
        
        var toR = parseInt(toHexColor.substr(0, 2), 16) ;
        var toG = parseInt(toHexColor.substr(2, 2), 16) ;
        var toB = parseInt(toHexColor.substr(4, 2), 16) ;

        var stepR = (fromR - toR) / (steps - 1);
        var stepG = (fromG - toG) / (steps - 1);
        var stepB = (fromB - toB) / (steps - 1);


        var retArray = [];

        for( i = 0; i < steps; i++ ) {
            var r = Math.floor(fromR - (stepR * i));
            var g = Math.floor(fromG - (stepG * i));
            var b = Math.floor(fromB - (stepB * i));

            retArray.push([r,g,b]);
        }

        return retArray;
}