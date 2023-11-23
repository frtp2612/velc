export function deepEqual(obj1: any, obj2: any) {
  // Check if the two objects are of the same type
  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  // If they are primitives, compare their values
  if (typeof obj1 !== "object" || obj1 === null) {
    return obj1 === obj2;
  }

  // Get the keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if they have the same number of keys
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Recursively compare the values of nested properties
  for (const key of keys1) {
    if (!deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  // If all checks pass, the objects are deep equal
  return true;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function RGBToHSL(
  r: number,
  g: number,
  b: number
): {
  h: number;
  s: number;
  l: number;
  formatted: string;
} {
  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  // Calculate hue
  // No difference
  if (delta == 0) h = 0;
  // Red is max
  else if (cmax == r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l, formatted: "hsl(" + h + "," + s + "%," + l + "%)" };
}

export function HSLToRGB(
  h: number,
  s: number,
  l: number,
  separator: string = " "
): {
  r: number;
  g: number;
  b: number;
  formatted: string;
} {
  // Must be fractions of 1
  // s /= 100;
  // l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h <= 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return {
    r,
    g,
    b,
    formatted: "rgb(" + r + separator + g + separator + b + ")",
  };
}

export function RGBToHSV(
  r: number,
  g: number,
  b: number
): {
  h: number;
  s: number;
  v: number;
} {
  (r = r / 255), (g = g / 255), (b = b / 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h! /= 6;
  }

  return { h: h!, s, v };
}

export function toRGBObject(rgbValue: string | undefined): {
  r: number;
  g: number;
  b: number;
} {
  if (rgbValue && rgbValue.match(/\d+/g) !== null) {
    const [r, g, b] = rgbValue.match(/\d+/g)!.map(Number);
    return { r, g, b };
  }
  return { r: 0, g: 0, b: 0 };
}

// //Parameters//
// var base_700 = '#ee0036';
// var comp_factor = -180;
// var grad_factor = 35;
// var comp_700 =  get_complementary(base_700);
// var edit_700 =  get_editor(base_700);
// var spin_factor = 16;
// var sat_factor = 3;
// var val_factor = 3;
// var light_sat = .08;
// var light_val = .992;
// var steps = 10;

// //Colors manipulation utils functions

// function get_light(color){
//   var light = tinycolor(color).spin(-spin_factor/2).toHsv();
//   return tinycolor({ h: Math.round(light.h) , s: light_sat, v: light_val }).toHexString();
// }

// function get_complementary(color){
//   var c = tinycolor(color).spin(-comp_factor).toHsv();
//   return tinycolor(c).toHexString();
// }

// function get_editor(color){
//   var c = tinycolor(color).toHsv();
//   //console.log('edit color h:'+c.h+ 's:' +c.s+ 'v:'+c.v);
//   if(c.h > 130)c.h -= 130;
//   else c.h = 360 + (c.h-130);
//   if (c.s<.9)c.s += .1;
//   else c.s = .9;
//   if (c.v<.8)c.v += .20;
//   else c.v = .8;
//   return tinycolor(c).toHexString();
// }

// function get_triad(color){
//   var colors = tinycolor(color).triad();
//   return colors.map(function(t) { return t.toHexString(); });
// }

// function get_grad(color){
//   var g = tinycolor(color).spin(grad_factor).toHsv();
//   return tinycolor(g).toHexString();
// }

// function generate_shades(_color, steps){
//   var out = [];
//   out.lenght = 0;
//   //first we get the lightest
//   var l = tinycolor(get_light(_color));

//   out.push(l.clone().toHexString());
//   //then declinaison
//   for (var i=1; i<steps; i++){
//     var c = tinycolor({
//       h: l.clone().spin( i * (spin_factor/steps)).toHsv().h,
//       s: l.clone().toHsv().s + Math.sin(i* (Math.PI / steps)/sat_factor),
//       v: Math.cos(i* (Math.PI / steps)/val_factor)
//     });
//     out.push(c.toHexString());
//   }
//   return out;
// }

// function inclusive_shades(_color, steps){
//   var _in = tinycolor(_color).toHsl().l;
//   var out = generate_shades(_color, steps);
//   var l_out = Array.from(out, x => tinycolor(x).toHsl().l )
//   var closest = l_out.reduce((a, b) => {
//       return Math.abs(b - _in) < Math.abs(a - _in) ? b : a;
//   });
//   var _c = l_out.indexOf(closest);
//   console.log(_c);
//   out.splice(_c, 1, _color)
//   return out;
// }

// //Colors entities creation

// jQuery.fn.extend({

//   generate:
//     function(_color, _steps, _inclusive){
//       if(!_inclusive)$(this).attach(_color);
//       $(this).create_shades(_steps);
//       if(_inclusive)var _c = inclusive_shades(_color, _steps);
//       else var _c = generate_shades(_color, _steps);

//       //console.log(_c);
//       $(this).decline_shades(_c);
//     },
//   //function to attach color to a list by creating the first item which will be the ref and get the color
//   attach :
//     function(_color){
//       $(this).attr('data-color', _color);
//       var _li = '<li class="ref"></li>';
//       $(this).append(_li).find('li').css('background-color', _color).attr({'data-hex': _color, 'data-rgb': tinycolor(_color).toRgbString()}).setText();
//    },
//   //function to create list of shades inside a ul list --> _steps --> is the number of shades we'll have
//   create_shades:
//     function(_steps){
//       _steps = _steps;
//       var _li = '<li></li>';
//       //$(this).append(_li).find('li').addClass('ref');
//       for (var i=0; i<_steps; i++){
//         $(this).append(_li);
//       }

//     },
//   //function to decline list _c --> is an array of shades generated by generate_shades()
//   decline_shades :
//     function(_c){
//       $(this).find('li').not('.ref').each(function(e){
//         $(this).css('background-color', _c[e]);
//         $(this).attr('data-hex', tinycolor(_c[e]).toHexString());
//         $(this).attr('data-rgb', tinycolor(_c[e]).toRgbString());
//         $(this).setText();
//       });
//     },
//   //function to calculate and compare the lightness to return the input color inside the array

//   //function to set a gradient entity (2 colors for start)
//   setGradient :
//     function(_color){
//       var _g = get_grad(_color);
//       var out = 'linear-gradient(-90deg,'+_color+','+_g+')';
//       $(this).attr('data-hex', tinycolor(_color).toHexString() + "|" + tinycolor(_g).toHexString());
//       $(this).attr('data-rgb', tinycolor(_color).toRgbString() + "|" + tinycolor(_g).toRgbString());
//       $(this).css('background', out);
//       $(this).setText();

//     },
//   //function to write text
//   setText :
//     function(){
//       //util
//       var _l = Math.round(tinycolor($(this).data('hex')).toHsl().l*100 );
//       //write output
//       var _hex = $(this).data('hex').split('|');
//       var _rgb = $(this).data('rgb').split('|');

//       var out = "";
//       for(var i=0; i<_hex.length; i++){
//         out += "<p>";
//         out += _hex[i];
//         out += "<br>";
//         out += _rgb[i];
//         out += "</p>";
//         //out += '<p>'+ _l + '</p>';
//       }

//       //display output

//       var out_color;
//       if(_l > 50){
//         out_color = "#000000"
//       }else{
//         out_color = "#ffffff"
//       }

//       //output
//       $(this).css('color', out_color);
//       $(this).html( out );
//   }
// });

// //Display

// $(function(){
//   $('.base').generate(base_700, steps, true);
//   $('.editor').generate(edit_700, steps, true);
//   $('.complementary').generate(comp_700, steps, true);
//   $('.gradient').setGradient(base_700);
// });
