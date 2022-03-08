app.loadFrames([
    {
        background : 'EverlastingSummer-Background (20).jpg',
        character : 'Sprite (171).png',
        audio : '06 - Let\'s Be Friends (Lena Theme).ogg',
        quotes : [
            ['Лена', 'Привет'],
            ['Лена', 'Я Лена, вскрываю вены)'],
            ['Лена', 'А ты?'],
            [CHOICE, 'Semen', {
                'А я Борис Америка' : {'Лена' : -5},
                'А я кидаю насвай' : {'Лена' : 100, 'МВД' : -50},
                'А я Семён' : {'Лена' : -100},
            }],
            [CONDITION, ['Лена', '=', 100], 'LenaRoot'],
            [CONDITION, ['Лена', '=', -5], 'LenaBad'],
        ],
    },

    {
        background : 'EverlastingSummer-Background (21).jpg',
        character : 'Sprite (181).png',
        audio : '28 - No Tresspassing.ogg',
        quotes : [
            ['Лена', 'Ебать, разраб, ты чё сделал? Хули ночь на дворе?'],
        ],
    },

    {
        background : 'EverlastingSummer-Background (21).jpg',
        character : 'Sprite (171)asdas.png',
        audio : '28 - No Tresspassing.ogg',
        quotes : [
            ['Лена', 'Тебе уебать?'],
        ],
    },

    {
        background : 'lizard-dance.gif',
        character : 'none.png',
        audio : 'outro.mp3',
        quotes : [
            ['Разработчик', 'Всё, конец.'],
        ],
    },
]);

app.loadGroups({
    'LenaRoot' : [{
                    background : 'EverlastingSummer-Background (112).jpg',
                    character : 'none.png',
                    audio : '41 - Miku Song (Flute).ogg',
                    quotes : [
                        ['Semen', 'Что происходит? Я опять куда-то телепортировался?'],
                    ],
                },
                {
                    background : 'EverlastingSummer-Background (112).jpg',
                    character : 'Sprite (193).png',
                    audio : '41 - Miku Song (Flute).ogg',
                    quotes : [
                        ['Лена', 'Семён, ты охуенен. Вот тебе положительная концовка'],
                    ],
                },
            ],

    'LenaBad' : [{
                    background : 'EverlastingSummer-Background (92).jpg',
                    character : 'Sprite (171)asdas.png',
                    audio : '32 - Miku\'s Song.ogg',
                    quotes : [
                        ['Лена', 'Пизда тебе Семён'],
                        ['Semen', 'За шо? НЕЕЕЕЕЕЕЕЕЕТ'],
                    ],
                },
            ],
});

app.confColors({
    'Лена' : '#9900FF',
    'Semen' : '#f4f4f4',
    'Разработчик' : 'magenta',
});