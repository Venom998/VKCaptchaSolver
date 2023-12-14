# VKCaptchaSolver
Use this VKontakte captcha breaker with 75-84% accuracy with Python, JS, 2023.

It works with RU or ENG captchas up to 7 characters long.

## Steps to start CaptchaSolver:
1) Clone the repo

```sh
git clone https://github.com/Venom998/VKCaptchaSolver.git
```
2) `cd captcha_solver`
3) Install all requirements: `npm install`
4) Run `node start_node.js`

### Prerequisites

Change `ai_model_lang_eng = false` to `true` in `start_node.js` if you want to use captchas with English characters only.

`model_eng.onnx` - supports only "English" captchas.

`model_ru.onnx` - supports only "Russian" captchas.


### Steps to train AI model:

0) Install all requirements(if not yet) using command `pip install -r requirements.txt`
1) download images from [here](https://mega.nz/folder/H4kHDA6b#s2ZHPAnKcfwdgnhSByRGow) (or use your own dataset), create folder **images** and place all dataset into 2 folders: **train** and **test**. Image name format: `answer123-randomseed.jpeg`
2) Configure [code/utils/config.py](code/utils/config.py) file - img_width, img_height, format, ect.
3) Run [code/statistics.py](code/statictics.py) for analyzing your dataset (it will print all characters, whose your captchas contains)
4) [code/main.py](code/main.py) - TRAIN your model
5) [code/test_mode.py](code/test_model.py) - Test your tensorflow model
6) [code/to_onnx.py](code/to_onnx.py) - Convert your model to ONNX format
7) [code/onnx_tester.py](code/onnx_tester.py) - Test your ONNX model
8) Write your own captcha-solver-adapter. For example you can look at [this file](vk_captcha_lib/vk_captcha/solver.py)

[code/tools.py](code/tools.py) - конфиг файл (файл модели, ) + тулзы

[code/test_mode.py](code/test_model.py) - тест модели на реальных данных
[code/to_onnx.py](code/to_onnx.py) - конверт модели tesorflow в формат onnx (для использования через onnxruntime)

[vk_captcha_lib](vk_captcha_lib) - код библиотеки vk_captcha по решению капчи
