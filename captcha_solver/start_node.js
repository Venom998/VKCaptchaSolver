var ort = require('onnxruntime-node');
var pkg = require('canvas')
var nj = require('jsnumpy');
const { createCanvas, loadImage } = pkg

var ai_model_lang_eng = false
var width = 130
var height = 50
var captcha_url = "https://api.vk.com/captcha.php?sid=2323832899382092"
Captcha_solver(captcha_url).then(result => {
    console.log(result)
})


async function Captcha_solver(captcha_url){
    var model_name = "./models/model_eng.onnx"
    if (ai_model_lang_eng == false) model_name = "./models/model_ru.onnx"

    var session = await ort.InferenceSession.create(model_name)
    var input = await Decode_image(captcha_url)
    var inputTensor = new ort.Tensor('float32', input, [1, width, height, 3])
    var outputTensor = await session.run({ image: inputTensor })
    return Get_result(outputTensor.dense2)
}

async function Decode_image(img_path){
    let canvas = createCanvas(width, height)
    let octx = canvas.getContext('2d')
    let img = await loadImage(img_path)
    octx.drawImage(img, 0, 0, width, height)
    let data = octx.getImageData(0, 0, width, height).data
    let pixels_arr = nj.fillWithNumber([width,height,3])
    let pixel_i = 0
    let input = []
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            pixels_arr[j][i] = [data[pixel_i + 2] / 255, data[pixel_i + 1] / 255, data[pixel_i] / 255];
            pixel_i+= 4
        }
    }
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            input.push(pixels_arr[i][j][0])
            input.push(pixels_arr[i][j][1])
            input.push(pixels_arr[i][j][2])             
        }
    }
    return input
}

function Get_result(outputTensor){
    let output_i = 0;
    let output = []
    for (let i = 0; i < outputTensor.dims[1]; i++) {
        output.push([])
        for (let j = 0; j < outputTensor.dims[2]; j++) {
            output[i].push(outputTensor.data[output_i])
            output_i++
        }
    }
    
    let characters = ['z', 's', 'h', 'q', 'd', 'v', '2', '7', '8', 'x', 'y', '5', 'e', 'a', 'u', '4', 'k', 'n', 'm', 'c', 'p']
    if (ai_model_lang_eng == false) characters = ['д', 'ж', 'ф', 'ш', 'т', 'у', 'к', 'х', 'а', '7', 'с', '5', '2', 'е', 'р', 'м']
  
    let accuracy = 1
    let last = 0
    let ans_arr = []
  
    output.forEach(item => {
        let char_ind = item.indexOf(Math.max(...item))
        if (char_ind != last && char_ind != 0 && char_ind !=characters.length+1){
            ans_arr.push(characters[char_ind - 1])
            accuracy = accuracy * item[char_ind]
        }
        last = char_ind
    });
   
    let answer = ans_arr.join('')
    return [answer, accuracy]
  }