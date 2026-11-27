title: Krampusnacht
id: krampusnacht
narrator: bm_george
music: eerie
accent: #ffb020
tempo: 1.06

cast:
  me: Leo | teen | hair=messy:#4a2e1c | top=#2f5f9a:hoodie | pants=#2a3040 | skin=#f2c9a8
  emma: Emma | kid | hair=pigtails:#c98a3a | top=#d9486a:sweater | top2=#ffe0e8 | pants=#3a3550 | voice=af_bella+3
  opa: Opa Josef | old | hair=bald:#e8e4dc | beard=full | top=#7a2a24:sweater | top2=#e9dcc0 | wrinkles | pants=#3a2f2a | skin=#efc4a4 | voice=am_onyx
  mum: Mum | adult | hair=bob:#6a3a1e | top=#3f6b5a:coat | voice=af_sarah
  krampus: Krampus | adult | top=#111 | voice=am_fenrir+-5
  lukas: Lukas | teen | hair=beanie:#2a2a2a | top2=#b3262e | top=#3a4a3a:jacket | pants=#2a2a30 | skin=#e8b48f | voice=am_echo
  toni: Toni | kid | hair=short:#3a2414 | top=#8a6a2a:sweater | top2=#e9dcc0 | pants=#4a3a2a | skin=#f2c9a8 | voice=am_puck+3
  dad: Dad | adult | hair=short:#3a2414 | top=#4a5a6a:jacket | beard=stubble | voice=am_michael

scenes:
  village: outside sky=snow moon=.78 far=alps ground=snow weather=snow | church .2 s=.75 y=-70 | chalet .64 s=.55 y=-90 | chalet 1.0 s=.42 y=-130 | streetlamp .86 s=.9 | pine .03 s=.8
  road: outside sky=snow moon=.3 far=alps ground=road weather=snow | pine .1 s=1.1 y=-60 | pine .9 s=1.2 y=-60 | car .5 v=drive c=#3a5a8a
  house: outside sky=snow moon=.82 far=pines ground=snow weather=snow | chalet .5 s=1.05 | pine .06 s=1.1 | pine .95 s=1.0
  living: room wall=#6b4a2f:wood floor=#4a2e1c:wood beams light=warm | window .3 v=curtain:#9a2424 | clock .62 y=-930 | tree .12 s=.85 | stove .86 | table .5 v=cloth | candles .5 y=-275 s=.55 | rug .5
  doorstep: room wall=#6a4a30:wood floor=#aab6d6:plain floorY=1500 cs=.8 light=moon weather=snow | door .5 s=1.25 | boots .5 s=1.5 y=140
  doorstep-birch: room wall=#6a4a30:wood floor=#aab6d6:plain floorY=1500 cs=.8 light=moon weather=snow | door .5 s=1.25 | boots .5 s=1.5 y=140 v=birch
  doorstep-choc: room wall=#8a6040:wood floor=#eef3fb:plain floorY=1500 cs=.8 light=day | door .5 s=1.25 | boots .5 s=1.5 y=140 v=choc
  doorstep-day: room wall=#8a6040:wood floor=#eef3fb:plain floorY=1500 cs=.8 light=day | door .5 s=1.25 | boots .3 s=1.4 y=140 v=choc | boots .7 s=1.4 y=140 v=birch
  square: outside sky=snow moon=.5 far=alps ground=snow weather=snow | church .5 s=.9 y=-140 | chalet .08 s=.5 y=-120 | chalet .95 s=.5 y=-120 | torches .5 y=40 | crowd .5 v=14 y=150
  bedroom: room wall=#5a3e2a:wood floor=#3e2a1a:wood light=moon | window .7 v=curtain:#7a1c1c | bed .32 c=#4a6fa5 | picture .3 y=-60
  bedroom-dark: room wall=#5a3e2a:wood floor=#3e2a1a:wood light=dark | window .66 v=curtain:#7a1c1c:closed s=1.2 | bed .25 c=#4a6fa5
  void: void
  archive: room wall=#4a3a2a:wood floor=#3a2a1a:wood light=warm | books .14 | books .86 | table .5 | candles .5 y=-275 s=.5 v=1
  church: room wall=#d8d0c0:stone floor=#6a5a4a:tile light=warm | window .2 v=curtain:#5a2a6a | window .8 v=curtain:#5a2a6a | candles .5 y=-40 s=1.2
  forest: outside sky=snow moon=.25 far=pines ground=snow weather=snow | pine .06 s=1.3 | deadtree .62 s=.9 | pine .94 s=1.4 | footprints .45 v=hoof
  forest-plain: outside sky=snow moon=.7 far=pines ground=snow weather=snow | pine .1 s=1.2 | pine .88 s=1.3 | pine .5 s=.7 y=-120
  mine-ext: outside sky=snow moon=.8 far=alps ground=snow weather=snow | cave .5 s=1.05 c=#4a4448 | pine .05 s=1.1 | footprints .5 v=hoof
  mine: room wall=#3a3436:stone floor=#2a2628:plain light=dark floorY=1420 | bootsrow .5 y=-20 | candles .15 y=-40 s=.6 v=1 | candles .85 y=-40 s=.6 v=1
  mine-ice: room wall=#3a3436:stone floor=#2a2628:plain light=dark floorY=1420 | ice .2 s=1.1 fg | ice .5 s=1.2 fg | ice .8 s=1.1 fg | candles .5 y=180 s=.6 v=1
  living-night: room wall=#6b4a2f:wood floor=#4a2e1c:wood beams light=dark | window .3 v=curtain:#9a2424:closed | clock .62 y=-930 | tree .12 s=.85 | stove .86 | table .5 v=cloth
  hall: room wall=#6b4a2f:wood floor=#4a2e1c:wood light=dark | door .5 s=1.3 v=chain | lamp .15 v=off | picture .82
  emma-room: room wall=#7a5a6a:stripes floor=#4a2e1c:wood light=moon | bed .62 c=#d9486a | window .25 v=curtain:#e0a0b0 | picture .7 y=-60
  emma-room-open: room wall=#7a5a6a:stripes floor=#4a2e1c:wood light=dark weather=snow | bed .62 c=#d9486a | window .25 v=day | picture .7 y=-60
  square-day: outside sky=day far=alps ground=snow | church .5 s=.9 y=-140 | chalet .08 s=.5 y=-120 | chalet .95 s=.5 y=-120

== 1
village | In the Alps, there's one night a year when parents lock their children *inside.* | cam=push t=black
doorstep | *December 5th.* | prop=calendar:5:DECEMBER:KRAMPUSNACHT
village | This is ^Krampus.^ | card=Krampus:The_Christmas_Demon_-_The_Alps:5 !horned:.5:idle+size=1.25
village | Half goat. Half demon. Black fur, iron chains, and a tongue that hangs past his chin. | close=creature !horned:.5:idle cam=push
village | He walks from house to house, ringing his *bells,* so you hear him coming. | !horned:.42:step+to=.6+size=1.1 sfx=bells
village | The good kids get presents. The bad ones... he takes ^with him.^ | close=creature !horned:.5:scream cam=zoom
road | I was sixteen when my parents sent me and my little sister to Opa's village for Advent. | tag=LAST_DECEMBER cam=right @me:.4:neutral:idle+y=80 @emma:.6:smile:idle+y=100
house | Opa lived in the very last house. Right where the *forest* starts. | @opa:.5:smile:wave+y=60 @emma:.2:smile:wave+y=140 @me:.78:neutral:idle+y=140 cam=push
living | On the first night, he gave us three *rules.* | @opa:.5:determined:talk @emma:.22:worried:idle+y=60 @me:.8:neutral:arms+y=60
living | opa> [serious] On the fourth, you put your boots outside the door. | close=opa rule=RULE_#1 @opa:.5:determined:talk
doorstep-choc | If you were good, there's *chocolate* in them. | cam=push
doorstep-birch | If you were bad... a bundle of ^birch sticks.^ | cam=push sfx=sub
living | opa> On the fifth, every door is locked by midnight. | close=opa rule=RULE_#2 @opa:.5:determined:talk
living | opa> [whispering] And if he says your name... you do not answer. | close=opa rule=RULE_#3 @opa:.5:scared:talk cam=zoom
living | I laughed. I'd seen the Krampus run online. Drunk guys in *costumes.* | @me:.62:grin:idle+y=40 @emma:.3:worried:idle+y=60 cam=push
square | On the fourth, the whole village came out for the *parade.* | !horned:.38:step+size=.85+to=.55 cam=right sfx=bells
square | Masks. Chains. Little kids *screaming* and laughing. | !horned:.6:scream+size=.9 fx=embers cam=shake
square | So I filmed one of them... and posted it. | @me:.5:grin:phone+item=phone+y=180+size=1.25 cam=push
square | | prop=phone:post:@leo.alps:krampus_is_just_a_guy_in_a_rug_lol/1,204_likes hold=2.2
square | Twelve minutes later, an account with *no picture* left one comment. | prop=phone:chat:Comments:krampus_is_just_a_guy_in_a_rug_lol/Tomorrow. sfx=buzz
bedroom | I put my boots outside, like Opa said... and went to bed laughing. | @me:.56:smile:lie+y=-205+size=.8 cam=creep
doorstep-day | The next morning, Emma's boots were full of *chocolate.* | cam=push
doorstep-birch | Mine had birch sticks. Tied with a ^black ribbon.^ | cam=zoom sfx=stinger
living | When Opa saw them, all the colour left his face. | close=opa @opa:.5:terrified:idle cam=push
living | opa> [fear] Leo. Who did you lie about? | close=opa,me @opa:.5:scared:talk @me:.5:worried:idle
living | I said nobody. That was my first lie. | close=me @me:.5:suspicious:idle cam=push
bedroom-dark | That night, at *2:13,* I heard bells... coming up the mountain. | tag=DECEMBER_5TH_-_2:13_AM sfx=bells cam=creep fx=dark
bedroom-dark | Then three slow ^knocks^ on my window. | sfx=knock win=horned cam=push
bedroom-dark | krampus> [whispering] Leeeo... | win=horned cam=zoom fx=shake
bedroom-dark | And I almost *answered.* | @me:.3:terrified:cover+y=60 cam=push sfx=heartbeat

== 2
bedroom-dark | Rule three. If he says your name... you do ^not^ answer. | rule=RULE_#3 cam=push fx=dark
bedroom-dark | krampus> [whispering] Leeeo. I saw your little video. | win=horned cam=zoom
bedroom-dark | I bit into my pillow so hard I tasted cotton. | @me:.3:terrified:hide+y=40 cam=shake sfx=heartbeat
bedroom-dark | Then the voice moved. Along the wall. Towards the room next to mine. | win=none cam=left sfx=steps
emma-room | Emma's room. | cam=push t=black
emma-room | krampus> [whispering] Emmaaa. Is your brother a good boy? | @emma:.62:sleep:lie+y=-205+size=.7 cam=creep
emma-room | And my eight-year-old sister... ^answered.^ | close=emma @emma:.5:worried:idle cam=zoom
emma-room | emma> [sleepy] Mm-hm. He's nice. | close=emma @emma:.5:sleep:idle
emma-room | She lied. For me. Without even waking up. | cam=pull @emma:.62:sleep:lie+y=-205+size=.7
hall | Downstairs, the front door chain started to ^rattle.^ | sfx=chains cam=push
hall | Then the bolt slid open. All by itself. | sfx=creak cam=zoom fx=shake
hall | And Opa stepped into the hallway with a *candle.* | @opa:.5:determined:hold+candle+y=120+size=1.1 cam=push
hall | opa> [angry] Not this house. Not this year! | close=opa @opa:.5:angry:hold+candle cam=shake
hall | The bells stopped. The door swung shut. And it was *quiet.* | sfx=door cam=pull @opa:.5:scared:hold+candle+y=120+size=1.1
doorstep-day | In the morning there were *hoof prints* in the snow. All the way around the house. | tag=DECEMBER_6TH cam=push
emma-room | And when Emma woke up, there was a black ribbon tied around her ^wrist.^ | close=emma @emma:.5:scared:hold cam=zoom sfx=sub
living | Opa wouldn't look at me. | @opa:.3:sad:sit @me:.7:worried:idle cam=creep
living | opa> [sad] Lies are what he eats, Leo. And yours fed him. Now he's hungry for her too. | close=opa @opa:.5:sad:talk
living | I didn't understand. Krampus wasn't real. Except... my phone buzzed. | @me:.5:worried:phone+item=phone+size=1.2+y=100 sfx=buzz
living | | prop=phone:chat:Comments:krampus_is_just_a_guy_in_a_rug_lol/Tomorrow./Two. hold=2.4
living | A second comment. Same account. One word. ^Two.^ | close=me @me:.5:terrified:phone+item=phone cam=zoom
living | Two nights left. Or two kids. I didn't know which was *worse.* | close=me @me:.5:scared:idle cam=push fx=shake

== 3
archive | The answer was in the church. In a book older than *Opa.* | cam=push t=black
square-day | The village kid who hated me, Lukas, had the key. | @lukas:.5:suspicious:arms+y=120 cam=right
square-day | lukas> You're the guy from the video. Everyone saw it. | close=lukas @lukas:.5:angry:talk
square-day | lukas> You know what you did? You *called* him. | close=lukas @lukas:.5:determined:point
archive | He took me to the archive anyway. | @lukas:.3:neutral:idle+y=100 @me:.7:neutral:idle+y=100 cam=creep
archive | | prop=book:CHRONICLE_OF_HALLBACH:1926:1926_-_Anna_R.,_9/1959_-_Hans_G.,_11/1959_-_Maria_K.,_8/1992_-_Toni_W.,_12/1992_-_Martin_B.,_10 hold=2.6
archive | Every *thirty-three* years, on Krampusnacht, kids from this village went missing. | prop=book:CHRONICLE_OF_HALLBACH::1926_-_Anna_R.,_9/1959_-_Hans_G.,_11/1959_-_Maria_K.,_8/1992_-_Toni_W.,_12/1992_-_Martin_B.,_10
archive | 1926. 1959. 1992. | prop=book:CHRONICLE_OF_HALLBACH::1926_-_Anna_R.,_9/1959_-_Hans_G.,_11/1959_-_Maria_K.,_8/1992_-_Toni_W.,_12/1992_-_Martin_B.,_10
archive | And this year was twenty twenty-five. Thirty-three years after *1992.* | close=me @me:.5:shocked:idle cam=zoom
archive | Then I saw the last name on the list. | prop=book:CHRONICLE_OF_HALLBACH:Martin_B.:1926_-_Anna_R.,_9/1959_-_Hans_G.,_11/1959_-_Maria_K.,_8/1992_-_Toni_W.,_12/1992_-_Martin_B.,_10
archive | ^Martin Brandl.^ Ten years old. | cam=zoom prop=book:CHRONICLE_OF_HALLBACH:Martin_B.:1926_-_Anna_R.,_9/1959_-_Hans_G.,_11/1959_-_Maria_K.,_8/1992_-_Toni_W.,_12/1992_-_Martin_B.,_10 sfx=stinger
archive | That's my *dad.* | close=me @me:.5:terrified:cover cam=shake
archive | My dad was taken by Krampus in 1992. But my dad is alive. He drives a Skoda. He picked us up from football. | close=me @me:.5:worried:idle
archive | lukas> [cold] He wasn't taken. Look at the name next to it. | close=lukas @lukas:.5:angry:point
archive | Toni W. Twelve years old. | prop=book:CHRONICLE_OF_HALLBACH:Toni_W.:1926_-_Anna_R.,_9/1959_-_Hans_G.,_11/1959_-_Maria_K.,_8/1992_-_Toni_W.,_12/1992_-_Martin_B.,_10
archive | lukas> Toni Weber. My uncle. He went instead of your dad. | close=lukas @lukas:.5:crying:talk cam=zoom
archive | lukas> [angry] And your grandfather is the one who ^sent him.^ | close=lukas @lukas:.5:angry:point cam=shake sfx=stinger

== 4
living-night | I called my dad that night. | @me:.5:worried:phone+item=phone+y=100+size=1.2 cam=push t=black
living-night | | prop=phone:call:Dad:calling... hold=1.6 sfx=buzz
living-night | dad> Leo? It's late. Everything okay at Opa's? | prop=phone:call:Dad:00:04
living-night | I asked him about December 5th, 1992. | close=me @me:.5:determined:phone+item=phone
living-night | And my dad... hung up. | prop=phone:call:Dad:call_ended cam=zoom sfx=click
living-night | Opa was sitting in the dark behind me. He'd heard everything. | @opa:.3:sad:sit+dim @me:.7:shocked:idle cam=creep
living-night | opa> [tired] Sit down, Leo. You deserve the truth. Even if I don't. | close=opa @opa:.5:sad:talk
village | opa> In 1992, your father got the birch sticks. He'd lied about breaking a window at the Webers' house. | tag=1992 cam=push fx=snow
village | opa> On Krampusnacht, the bells came for him. And I was a coward. | !horned:.6:step+size=.9 @opa:.3:terrified:hold+candle
village | opa> [crying] I told Krampus... it was Toni Weber who broke the window. | close=opa @opa:.5:crying:talk cam=zoom
village | One lie. And the monster ^believed him.^ | close=creature !horned:.5:idle cam=push sfx=sub
village | That night, Toni Weber vanished. My dad grew up. | !horned:.6:step+to=.9 cam=right sfx=bells
living-night | opa> A lie for a lie. That's his price. And now he's back to collect the ^interest.^ | close=opa @opa:.5:scared:talk cam=zoom
living-night | Then something moved on the stairs. | sfx=creak cam=push
living-night | Lukas. He'd followed me. He'd heard every word. | @lukas:.85:angry:idle+y=40 @opa:.3:shocked:sit @me:.6:shocked:idle cam=left
living-night | lukas> [angry] Thirty-three years my grandmother waited for him. | close=lukas @lukas:.5:crying:talk
living-night | lukas> I hope he takes ^all of you.^ | close=lukas @lukas:.5:angry:point cam=shake
living-night | He ran out into the snow. And outside, the bells started *ringing.* | sfx=bells cam=zoom tag=DECEMBER_6TH_-_11:58_PM

== 5
village | Here's what I learned about Krampus that week. | cam=push t=black fx=snow
village | He can't take you just because you're bad. He needs a *lie* with your name on it. | !horned:.5:idle+size=1.1 rule=RULE_#4 cam=zoom
emma-room | And Emma had told one. For me. That's why the ribbon was on ^her wrist.^ | close=emma @emma:.5:worried:hold cam=push
living | Opa said there was only one way to break a mark. | @opa:.4:sad:sit @me:.65:worried:idle cam=creep
living | opa> You confess the lie. To his face. On the last night. | close=opa rule=RULE_#5 @opa:.5:determined:talk
living | opa> Or... you give the lie to someone else. | close=opa @opa:.5:sad:talk cam=zoom
living | You blame someone. And the mark ^moves.^ | close=me @me:.5:suspicious:think cam=push
square-day | The next day, Lukas told the whole village my video "called the demon". | @lukas:.4:angry:point+y=100 @me:.7:sad:idle+y=100 cam=right
square-day | Kids threw snow at me. Their parents locked their doors. | @me:.5:sad:idle+y=150+size=1.2 cam=push
square-day | And I thought: it would be so easy. | close=me @me:.5:angry:idle cam=zoom
square-day | I could tell everyone Lukas made that comment. ^Tomorrow.^ ^Two.^ | close=me @me:.5:suspicious:idle
square-day | One lie. And the ribbon would be on *his* wrist. Not Emma's. | close=me @me:.5:determined:fists cam=push
emma-room | Then Emma showed me her drawing. | @emma:.4:smile:hold+letter+y=100 @me:.7:sad:idle+y=100
emma-room | | prop=note:Me_+_Leo/no_lies/from_now_on hold=2.3
emma-room | emma> [happy] It's a promise. No more lies. Then he can't take anybody. | close=emma @emma:.5:smile:talk
emma-room | I promised her. And I meant it. | close=me @me:.5:relief:idle cam=push
emma-room | That night, I checked her ribbon before bed. | @emma:.62:sleep:lie+y=-205+size=.7 @me:.3:worried:idle+y=60 cam=creep
emma-room | It was gone. | cam=zoom
emma-room | And when I looked at my own wrist... there were ^two.^ | close=me @me:.5:terrified:hold cam=shake sfx=stinger

== 6
bedroom-dark | Two ribbons. Two lies. Krampus was keeping *count.* | close=me @me:.5:scared:hold cam=push t=black fx=dark
bedroom-dark | I knew the first one. Nobody. "Who did you lie about?" "Nobody." | close=me @me:.5:sad:idle
bedroom-dark | But the second one was older. The real reason I was here. | close=me @me:.5:sad:idle cam=zoom
living | Back home, my best friend Jonas got *expelled.* Somebody spray-painted the school. | tag=THREE_WEEKS_EARLIER cam=push
living | Everyone thought it was Jonas. Because I ^told them^ it was Jonas. | close=me @me:.5:suspicious:arms cam=zoom sfx=sub
bedroom-dark | Krampus knew. He'd always known. | win=horned cam=push sfx=bells
living-night | December 6th. The second night. Opa nailed boards over every window. | @opa:.5:determined:carry+box+y=80 cam=push tag=DECEMBER_6TH
living-night | We sat around the stove. Three candles. Three of us. | @opa:.5:scared:hold+candle+y=60 @emma:.25:scared:hug+y=80 @me:.75:scared:idle+y=80 cam=creep
living-night | At midnight, the phone rang. | sfx=buzz cam=zoom
living-night | | prop=phone:call:Mum:incoming_call... hold=1.6
living-night | mum> [crying] Emma, sweetie? It's Mummy. Open the door, it's freezing out here. | prop=phone:call:Mum:00:12
living-night | Mum was in Vienna. Four hours away. | close=me @me:.5:terrified:idle cam=zoom
living-night | mum> [crying] Emma! Please! I can see the light in the window! | prop=phone:call:Mum:00:19 fx=shake
living-night | Emma looked at me. Then at the door. | close=emma @emma:.5:crying:idle cam=push
living-night | emma> [crying] Leo, what if it's really her? | close=emma @emma:.5:crying:talk
living-night | And for one second... I didn't say anything. | close=me @me:.5:sad:idle cam=creep
living-night | One second was all it took. | t=flash sfx=door cam=shake fx=flicker
hall | The door was open. Snow was blowing in. | sfx=gust cam=push fx=snow
hall | And Emma was ^gone.^ | cam=zoom sfx=stinger
doorstep | All that was left was her teddy bear... and a trail of hoof prints into the *forest.* | cam=push

== 7
forest | I didn't wait for Opa. I took his lantern and followed the prints. | @me:.5:determined:torch+lantern+y=120 cam=right t=black fx=snow
forest | Somebody was already there. Lukas. With a torch. | @lukas:.75:scared:torch+y=80 @me:.3:shocked:idle+y=120 cam=push
forest | lukas> [ashamed] I heard the bells. I heard her scream. I'm not like him. | close=lukas @lukas:.5:sad:talk
forest | lukas> And my uncle is up there. I'm coming with you. | close=lukas @lukas:.5:determined:talk cam=push
forest-plain | We walked for an hour. The prints never got *smaller.* | @me:.35:scared:walk+to=.55+lantern @lukas:.6:scared:walk+to=.8 cam=right
forest-plain | They went straight up the mountain. To the old silver mine. | cam=up
mine-ext | Every kid in Hallbach knows the mine. It's been closed since 1926. | cam=push
mine-ext | Everyone calls it the ^Krampusloch.^ The Krampus hole. | cam=zoom win=eyes sfx=sub
mine | Inside, it was warm. Like breath. | @me:.4:scared:hold+lantern+y=60 @lukas:.65:scared:torch+y=60 cam=creep fx=dust
mine | And there were boots. Hundreds of children's boots. | cam=left
mine | Every pair full of *birch sticks.* | cam=push
mine-ice | Behind them... the ^ice.^ | cam=pull t=flash sfx=stinger
mine-ice | Kids. Frozen in blocks of ice. In old-fashioned clothes. | @emma:.2:sleep:idle+y=-40 @toni:.5:sleep:idle+y=-40 cam=creep
mine-ice | They weren't dead. They were ^breathing.^ | cam=zoom sfx=heartbeat @toni:.5:sleep:idle+y=-40 @emma:.2:sleep:idle+y=-40
mine-ice | And in the middle... Emma. Asleep. With a bundle of birch sticks in her arms. | close=emma @emma:.5:sleep:hold
mine-ice | Lukas stopped in front of the biggest block. | @lukas:.62:shocked:idle+y=150+size=1.3 cam=push
mine-ice | Inside was a boy. Twelve years old. In a sweater from 1992. | close=toni @toni:.5:sleep:idle
mine-ice | lukas> [whispering] Uncle Toni? | close=lukas @lukas:.5:crying:talk
mine-ice | And the boy in the ice... ^opened his eyes.^ | close=toni @toni:.5:shocked:idle cam=zoom sfx=stinger

== 8
mine-ice | Toni Weber had been twelve years old for thirty-three years. | close=toni @toni:.5:blank:idle cam=push t=black
mine-ice | His lips didn't move. But we heard his voice anyway. | close=toni @toni:.5:sad:idle sfx=whisper
mine-ice | toni> [whispering] You shouldn't be here. He's coming back for the last night. | close=toni @toni:.5:scared:talk
mine-ice | toni> [whispering] He keeps us. He doesn't eat us. He eats the ^lies^ people told about us. | close=toni @toni:.5:sad:talk cam=zoom
mine | toni> [whispering] And every year the lie isn't confessed... the ice gets thicker. | @me:.35:scared:hold+lantern+y=60 @lukas:.65:crying:idle+y=60 cam=creep
mine | I asked him how we get Emma out. | close=me @me:.5:determined:idle
mine-ice | toni> [whispering] The one who lied says the truth. To his face. Out loud. | close=toni rule=RULE_#5 @toni:.5:determined:talk
mine-ice | toni> [whispering] But he doesn't make it easy. He'll offer you a trade. | close=toni @toni:.5:worried:talk cam=push
mine | Then the bells. Close. Inside the mountain. | sfx=bells cam=shake fx=dark
mine | Chains on stone. The smell of wet fur. | sfx=chains cam=push
mine | Lukas dropped the torch. The light went out. | t=flash fx=blackout sfx=sub
mine | And in the dark, two yellow eyes opened. ^Higher^ than any man. | win=eyes fx=blackout cam=zoom
mine | krampus> [whispering] Leo. You came to confess? | !horned:.5:idle+size=1.3 fx=dark cam=up
mine | krampus> [whispering] Or you came to ^trade?^ | close=creature !horned:.5:idle cam=zoom
mine | krampus> Give me one name. Any name. Say they lied. And you walk out with your sister. | close=creature !horned:.5:reach cam=push
mine | He pointed one long black finger... at Lukas. | !horned:.4:reach+size=1.3 @lukas:.8:terrified:hands-up+y=80 cam=right
mine | krampus> [whispering] His family hates yours. Nobody would ^blame you.^ | close=creature !horned:.5:idle cam=zoom sfx=heartbeat

== 9
mine | Lukas looked at me. He knew what I was going to do. He'd do the same. | close=lukas @lukas:.5:terrified:idle cam=push t=black fx=dark
mine | And then a light came up the tunnel. A *candle.* | @opa:.15:determined:hold+candle+y=80+to=.3 !horned:.7:idle+size=1.3 cam=left fx=dark
mine | Opa. Seventy-eight years old. He'd climbed the whole mountain in the snow. | close=opa @opa:.5:determined:hold+candle
mine | opa> [angry] You want a confession? Start with mine. | close=opa @opa:.5:angry:hold+candle cam=push
mine | opa> In 1992, I lied. Toni Weber never broke that window. My son did. | close=opa @opa:.5:crying:hold+candle cam=zoom
mine | opa> [crying] I gave you an innocent boy to save my own. And I've lied about it every day since. | close=opa @opa:.5:crying:hold+candle
mine-ice | Behind us... the ice around Toni ^cracked.^ | close=toni @toni:.5:shocked:idle sfx=glass cam=shake
mine | Krampus screamed so loud the stones fell from the ceiling. | close=creature !horned:.5:scream cam=shake fx=shake
mine | krampus> One lie paid. ^One lie left.^ Your turn, boy. | close=creature !horned:.5:idle cam=zoom
mine | So I said it. Out loud. For the first time. | close=me @me:.5:sad:idle cam=push
mine | I said: Jonas didn't spray the school. ^I did.^ | close=me @me:.5:crying:idle cam=zoom
mine | I said: I let my best friend get expelled because I was scared. | close=me @me:.5:crying:idle
mine-ice | The ice around Emma melted like it was summer. | @emma:.5:relief:idle+y=60 cam=push sfx=glass
mine-ice | She ran into my arms. | @emma:.45:crying:hug+y=80 @me:.6:crying:hug+y=80 cam=creep
mine | And Krampus laughed. | close=creature !horned:.5:idle cam=zoom sfx=sub
mine | krampus> [whispering] Two marks, boy. ^Two lies.^ You've only paid for one. | close=creature !horned:.5:reach cam=push
mine | He was right. I'd forgotten the first one. | close=me @me:.5:terrified:idle cam=zoom
mine | "Who did you lie about?" | close=me @me:.5:terrified:idle
mine | ^"Nobody."^ | close=me @me:.5:terrified:cover cam=shake sfx=stinger

== 10
mine | My first lie. The smallest one. "Nobody." | close=me @me:.5:scared:idle cam=push t=black fx=dark
mine | The truth was... I'd lied about Lukas. | close=me @me:.5:sad:idle cam=zoom
mine | That comment. "Tomorrow." I wrote it myself. From a fake account. | close=me @me:.5:sad:idle
mine | I wanted the video to look *scarier.* More views. | prop=phone:chat:Comments:krampus_is_just_a_guy_in_a_rug_lol/Tomorrow./Two.
mine | And when the village blamed Lukas for the comments... I ^let them.^ | close=me @me:.5:crying:idle cam=push
mine | Lukas just stared at me. | close=lukas @lukas:.5:shocked:idle cam=zoom
mine | And then he did the bravest thing I've ever seen. | close=lukas @lukas:.5:sad:idle
mine | lukas> I forgive him. You hear me? I'm not lying. ^I forgive him.^ | close=lukas @lukas:.5:determined:talk cam=push
mine | Krampus didn't have anything left to eat. | close=creature !horned:.5:frozen cam=pull
mine-ice | Every block of ice in that mountain cracked at the same time. | cam=shake sfx=glass t=flash
mine-ice | Kids from 1926. From 1959. From 1992. Walking out into the snow. | @toni:.5:relief:walk+to=.7+y=40 @emma:.25:smile:walk+to=.45+y=80 cam=right
mine-ext | Toni Weber came home. Twelve years old. To a mother who was eighty-four. | @toni:.45:crying:hug+y=120 cam=push fx=snow
mine-ext | And Krampus walked back up the mountain. Ringing his bells. Slower than before. | !horned:.5:step+to=.8+size=.8 cam=up sfx=bells
square-day | I called Jonas. I told the school the truth. I deleted the video. | tag=ONE_YEAR_LATER @me:.5:smile:phone+item=phone+y=150+size=1.2 cam=push
square-day | Lukas and I are friends now. Real ones. | @lukas:.35:smile:wave+y=120 @me:.65:smile:idle+y=120 cam=creep
doorstep-day | This December, Emma and I went back to Opa's. We put our boots outside. | cam=push @me:.2:smile:idle+y=60 @emma:.8:smile:idle+y=80
doorstep-choc | Chocolate. Both pairs. | cam=zoom
doorstep-birch | But this morning, there was a third pair of boots on the doorstep. Little ones. I've never seen them before. | cam=push
doorstep-birch | Full of birch sticks. And a note in a child's handwriting. | cam=zoom
doorstep-birch | | prop=note:See_you/in_33_years./-_A. hold=2.6 sfx=stinger
doorstep-birch | ^Anna.^ The first name in the book. 1926. She never came out of the ice. | cam=zoom
