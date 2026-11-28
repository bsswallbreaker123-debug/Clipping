title: Left Behind
id: left-behind
narrator: bm_george
music: mystery
accent: #ffd23a
tempo: 1.05

cast:
  me: Ben | kid | hair=messy:#c9862e | top=#c0242c:sweater | top2=#f4efe6 | pants=#2a3a5a | skin=#f6d7bf | voice=am_puck+4
  max: Max | teen | hair=spiky:#7a4a1e | top=#2f5f9a:hoodie | skin=#f6d7bf | voice=am_echo
  mum: Mum | adult | hair=bob:#a0522d | top=#3f6b5a:coat | skin=#f6d7bf | voice=af_sarah
  dad: Dad | adult | hair=short:#5a3a22 | top=#7a5a3a:sweater | top2=#e9dcc0 | glasses | voice=am_michael
  tall: Gus | adult | hair=beanie:#c0242c | top=#3a3a40:coat | beard=stubble | height=1.15 | build=.85 | voice=am_fenrir
  short: Lenny | adult | hair=cap:#2a4a2a | top=#5a4a3a:jacket | build=1.35 | height=.88 | beard=full | voice=am_adam
  marley: Mr. Novak | old | hair=bald | beard=full | top=#2a2a30:coat | wrinkles | voice=bm_george
  cop: Officer | adult | hair=cap:#1a2a4a | top=#1a2a4a:uniform | voice=am_eric

scenes:
  street: outside sky=snow moon=.7 far=hills ground=snow weather=snow | house .25 s=.6 v=lights y=-40 | house .78 s=.6 y=-40 c=#a8b8c8 | streetlamp .52
  street-day: outside sky=day far=hills ground=snow light=day | house .25 s=.6 v=lights y=-40 | house .78 s=.6 y=-40 c=#a8b8c8 | streetlamp .52 v=off
  house: outside sky=snow moon=.8 far=pines ground=snow weather=snow | house .5 s=1.05 v=lights | pine .06 s=1.1
  van: outside sky=snow far=hills ground=road weather=snow | van .5 c=#e8e8e8 | streetlamp .12
  living: room wall=#a84a3a:stripes floor=#6a4026:wood light=warm | tree .18 s=.9 | fireplace .8 | window .5 v=curtain:#2f6b4a | sofa .52 c=#3a5a8a | rug .5
  living-dark: room wall=#a84a3a:stripes floor=#6a4026:wood light=dark | tree .18 s=.9 | window .5 v=curtain:#2f6b4a | sofa .52 c=#3a5a8a
  kitchen: room wall=#e8dcc0:tile floor=#c8b89a:check light=warm | counter .5 c=#8a6a4a | fridge .85 | window .3 y=-700
  stairs: room wall=#d8c8a8:stripes floor=#6a4026:wood light=warm | stairs .5 c=#7a4a2a | picture .2 | picture .85
  stairs-dark: room wall=#d8c8a8:stripes floor=#6a4026:wood light=dark | stairs .5 c=#7a4a2a | picture .2
  attic: room wall=#6a4a32:wood floor=#4a3220:wood beams light=warm | bed .3 c=#5a7a3a | window .72 | lamp .9
  bedroom: room wall=#4a6a8a:stripes floor=#6a4026:wood light=moon | bed .3 c=#c0242c | window .72 v=curtain:#2f4f6a | shelf .3
  airport: room wall=#c8d0d8:tile floor=#9aa4ae:check light=cold | crowd .5 v=12 y=80 c=#5a5a68 | window .5 v=day
  church: room wall=#d8d0c0:stone floor=#6a5a4a:tile light=warm | window .2 v=curtain:#5a2a6a | window .8 v=curtain:#5a2a6a | candles .5 y=-40 s=1.2
  basement: room wall=#5a5a5a:brick floor=#3a3a3a:concrete light=dark | stove .82 c=#2a2a2a | lamp .2 v=off
  yard: outside sky=snow moon=.4 far=pines ground=snow weather=snow | deadtree .78 s=1.1 | fence .5 y=-40
  void: void

== 1
living | When I was nine, my family flew to Spain for Christmas. Eleven of them. | cam=push @me:.5:worried:idle+y=80
void | They forgot to count to ^twelve.^ | close=me @me:.5:shocked:idle cam=zoom
living | The night before the flight, my house was chaos. Cousins. Suitcases. Pizza everywhere. | @dad:.2:angry:talk+y=80 @mum:.45:worried:carry+box+y=80 @max:.75:grin:idle+y=80 cam=right
kitchen | And my big brother Max ate the last cheese pizza. *My* pizza. | @max:.35:smug:hold+y=80 @me:.7:angry:fists+y=80 cam=push
kitchen | So I punched him. Right in the stomach. | t=flash sfx=slam cam=shake
kitchen | mum> [angry] Ben! Attic! Now! And you can stay up there all Christmas for all I care! | close=mum @mum:.5:angry:point
attic | So I went up to the attic. And I wished something terrible. | @me:.3:angry:sit+y=-120 cam=creep
attic | I wished my whole family would ^disappear.^ | close=me @me:.5:angry:idle cam=zoom
attic | That night, a storm knocked out the power. All the alarms reset. | fx=flicker,dark cam=push sfx=thunder
street-day | Morning. Two taxis. Eleven people. Running late. | cam=right sfx=steps
street-day | They counted heads. They counted the neighbour's kid. Twice. | cam=push
street-day | And they left. | cam=pull sfx=whoosh
attic | When I came down, the house was ^empty.^ | @me:.5:shocked:idle+y=-120 cam=push t=black
living | No Mum. No Dad. No Max. Eleven people. Gone. | @me:.5:shocked:idle+y=100 cam=zoom
living | I'd made my family disappear. | close=me @me:.5:shocked:idle
living | I waited for the guilt to come. | close=me @me:.5:sad:idle cam=push
living | It didn't. | close=me @me:.5:grin:idle cam=zoom
living | I ate ice cream for breakfast. I jumped on my parents' bed. I watched a movie I wasn't allowed to watch. | @me:.5:grin:wave+y=60 cam=right sfx=pop
street | And that night, a white van drove slowly down our street. | cam=push sfx=steps
van | Inside were two men. They'd been robbing empty houses on Christmas for six years. | @tall:.35:smug:idle+y=100 @short:.68:grin:idle+y=100 cam=push
van | tall> [laugh] Number six-forty-two. Whole family in Spain. Easy money. | close=tall @tall:.5:grin:talk
van | That was ^my^ house. | close=me @me:.5:shocked:idle cam=zoom sfx=stinger

== 2
van | The newspapers called them the ^Snowmen.^ | prop=news:THE_SNOWMEN_STRIKE_AGAIN:THE_DAILY:They_leave_a_snowman_at_every_house_they_rob t=black hold=2.6
van | They robbed one house a night. And left a snowman in the garden. As a joke. | cam=push
van | Lenny. Short. Strong. Hated kids. Gus. Tall. Hated everything. | @short:.3:angry:arms+y=100 @tall:.7:smug:idle+y=100 cam=right
house | I watched them from my window. Gus walked right up to our front door. | @tall:.5:smug:walk+to=.5+y=180 cam=push
house | He checked the lock. He looked through the window. | close=tall @tall:.5:suspicious:idle
living-dark | And I ran around the house turning on every light. | fx=flicker sfx=click cam=shake @me:.15:determined:run+to=.85+y=80
house | tall> [suspicious] Lights are on. Somebody's home. We come back on Christmas Eve. | close=tall @tall:.5:suspicious:talk
house | short> Nine PM. When everybody's at church. | close=short @short:.5:grin:talk cam=push
living | So I called the police. Like a responsible nine-year-old. | @me:.5:determined:phone+item=phone+y=100 cam=push
living | | prop=phone:call:POLICE:connected hold=1.4
living | cop> Son, are your parents home? | prop=phone:call:POLICE:00:14
living | I said no. They're in Spain. They forgot me. And two robbers are coming on Christmas Eve. | close=me @me:.5:worried:phone+item=phone
living | cop> [laugh] Sure, kid. And I'm Santa Claus. | prop=phone:call:POLICE:call_ended sfx=click
living | Click. | close=me @me:.5:angry:idle cam=zoom
street-day | The next day I went to buy milk. And the old man from next door was shovelling snow. | @marley:.75:blank:idle+y=150 @me:.3:scared:walk+to=.4+y=150 cam=right
street-day | Mr. Novak. Every kid on our street said he killed his whole family with that shovel. | close=marley @marley:.5:blank:idle cam=push
street-day | He looked at me. | close=marley @marley:.5:suspicious:idle cam=zoom
street-day | marley> Where are your parents, boy? | close=marley @marley:.5:suspicious:talk
street-day | I ran. I didn't stop until I was home. | @me:.5:terrified:run+to=.1+y=150 cam=left sfx=steps
living | That night, on my bed, I made a plan. On my brother's homework. | @me:.5:determined:write+y=100 cam=push
void | | prop=poster:OPERATION/HOLD_THE_FORT:9_PM_-_CHRISTMAS_EVE hold=2.4 sfx=page
living | Two robbers. One nine-year-old. Three days. | close=me @me:.5:determined:idle cam=zoom

== 3
airport | Meanwhile, somewhere over France... my mum sat up in her seat and screamed. | @mum:.5:terrified:idle+y=120+size=1.1 t=black cam=push
airport | mum> [fear] BEN! | close=mum @mum:.5:terrified:talk cam=shake
airport | It's Christmas. Every flight is full. Every phone line is busy. | cam=right sfx=crowd
airport | mum> [crying] I don't care if I have to fly on a goat. I am going home. | close=mum @mum:.5:crying:talk
kitchen | Back home, I went shopping with my piggy bank. Eleven dollars and forty cents. | @me:.5:determined:carry+bag+y=100 cam=push
kitchen | Marbles. Glue. A bag of feathers. Christmas lights. Two hundred toy cars. | prop=poster:SHOPPING_LIST/marbles/glue/feathers/toy_cars:$11.40
kitchen | The cashier didn't ask any questions. It was Christmas. | cam=creep
basement | I tested everything in the basement. Every trap. Twice. | @me:.5:determined:crouch+y=60 cam=right sfx=pop
basement | Some of them worked too well. | t=flash sfx=slam cam=shake
basement | I got glue in my hair. It's still not completely out. | close=me @me:.5:pain:idle
church | On the morning of Christmas Eve, I went to church. Alone. | @me:.5:sad:sit+y=60 cam=push
church | And Mr. Novak was sitting in the next row. | @marley:.75:sad:sit+y=60 @me:.3:scared:sit+y=60 cam=right
church | marley> [quiet] I'm not as scary as they say, you know. | close=marley @marley:.5:sad:talk
church | marley> My son and I had a fight. Twelve years ago. We haven't spoken since. | close=marley @marley:.5:sad:talk cam=push
church | marley> Don't ever let a fight last that long, boy. | close=marley @marley:.5:sad:talk
church | I thought about Max. And the pizza. And how I'd wished them all away. | close=me @me:.5:crying:idle cam=creep
street | I walked home in the dark. Four o'clock. Five hours until the Snowmen. | cam=push tag=CHRISTMAS_EVE_-_4:00_PM
street | Then I saw it. The white van. Already parked outside my house. | cam=zoom sfx=sub
street | They weren't coming at nine. They were coming ^now.^ | close=me @me:.5:terrified:idle cam=shake sfx=stinger

== 4
house | Five hours early. My traps weren't even set. | @tall:.22:smug:walk+to=.38+y=150 @short:.78:grin:walk+to=.64+y=180 t=black cam=push
living-dark | So I did the only thing I could think of. I threw a ^party.^ | close=me @me:.5:determined:idle fx=dark
living | Cardboard cut-outs in the windows. On strings. A toy train moving them around. | cam=right fx=flicker
living | Music on full blast. The TV on a gangster movie. | sfx=crowd cam=shake
house | From outside, it looked like the biggest Christmas party in town. | cam=pull
house | short> [confused] They said the family was in Spain! | close=short @short:.5:shocked:talk
house | tall> [angry] Someone lied to us. We come back tonight. When the party's over. | close=tall @tall:.5:angry:talk
street | The van drove away. And I sat down in the snow and laughed until I cried. | @me:.5:relief:sit+y=150 cam=push
living | But I'd bought myself five hours. And I used every minute. | close=me @me:.5:determined:idle cam=zoom
stairs | Toy cars on every step. | cam=up sfx=pop @me:.75:grin:crouch+y=80
kitchen | Glue on the floor by the back door. Feathers in the fan. | cam=right @me:.6:grin:idle+item=box+y=60
living | The doorknob, plugged into a car battery. Just a tickle. I'm not a monster. | cam=push sfx=buzz @me:.3:smug:idle+y=60
attic | And a rope from the attic window... to Mr. Novak's tree house. | cam=up @me:.4:determined:idle+y=60
living | Nine o'clock. I sat by the tree with a flashlight and a slingshot. | @me:.5:determined:sit+torch+y=60 tag=9:00_PM cam=creep
living-dark | Then the doorbell rang. | sfx=bells cam=zoom
living-dark | Not the back door. Not the window. The front door. Polite. | cam=push
living-dark | And through the frosted glass, I saw something I didn't expect. | cam=zoom
living-dark | A dog. A huge, hungry ^dog.^ | close=me @me:.5:terrified:idle cam=shake sfx=stinger

== 5
living-dark | They'd brought a dog. A Rottweiler named Brutus. Every trap in the house was built for humans. | t=black cam=push fx=dark
house | The door burst open. Brutus came first. | t=flash sfx=door cam=shake
stairs-dark | He ran straight across the toy cars like they were nothing. Four legs. Perfect balance. | cam=right fx=dark sfx=steps
stairs-dark | I threw the only thing I had left. My ham sandwich. | @me:.5:terrified:point+y=-300+size=.8 fx=dark
stairs-dark | Brutus stopped. Sniffed. And sat down to eat it. | cam=push fx=dark sfx=pop
stairs-dark | Best eight seconds of my life. | close=me @me:.5:relief:idle fx=dark
stairs-dark | Then Lenny ran in after him. And hit the toy cars at full speed. | @short:.3:shocked:run+to=.5+y=60 fx=dark cam=right
stairs-dark | He did a backflip. A real one. And landed on Gus. | t=flash sfx=slam cam=shake fx=dark
kitchen | Gus went around the back. Straight into the glue. | @tall:.5:angry:walk+to=.55+y=100 cam=push
kitchen | His boots stuck. He pulled his feet out of them. And stepped into more glue. In his socks. | @tall:.5:pain:idle+y=100 cam=zoom
kitchen | Then I turned on the fan. | sfx=whoosh cam=shake fx=snow
kitchen | Two thousand feathers. Gus looked like a very angry chicken. | @tall:.5:angry:fists+y=100 fx=snow cam=push
kitchen | tall> [angry] I'm gonna get you, you little ^RAT!^ | close=tall @tall:.5:angry:talk cam=shake
living | Lenny grabbed the doorknob to the living room. | @short:.5:angry:reach+y=100 cam=push
living | Bzzzt. | t=flash sfx=buzz cam=shake fx=flicker
living | His hair stood straight up. He said a word I'm not allowed to repeat. | close=short @short:.5:pain:idle
attic | I ran up to the attic. The rope was waiting. | @me:.3:determined:run+to=.65+y=-120 cam=right
attic | But when I opened the window... the rope ^wasn't there.^ | close=me @me:.5:terrified:idle cam=zoom
attic | And behind me, the attic door slowly opened. | sfx=creak cam=push sfx=stinger

== 6
attic | It was Gus. Covered in feathers. Holding my rope. | @tall:.5:angry:hold+y=-100+size=1.15 t=black cam=push
attic | tall> [angry] Looking for this, rat? | close=tall @tall:.5:smug:talk
attic | I was trapped. Three floors up. Nine years old. | close=me @me:.5:terrified:idle cam=zoom
attic | So I jumped. Onto the bed. Off the bed. And out the window onto the roof. | t=flash cam=shake sfx=whoosh
house | Our roof was covered in ice. I slid all the way down... | cam=down sfx=gust
house | ...and landed in a pile of snow. Right in front of the van. | @me:.5:shocked:sit+y=160 cam=push sfx=slam
house | Lenny was waiting for me. With a bag. | @short:.5:grin:hold+bag+y=150+size=1.15 cam=zoom
house | short> [laugh] Gotcha. | close=short @short:.5:grin:talk
house | He picked me up by my sweater. Like a kitten. | @short:.5:grin:carry+y=150 cam=push
house | short> [calm] Now we're gonna take everything in that house. And you're gonna ^watch.^ | close=short @short:.5:smug:talk
house | I shut my eyes. I thought about Max. And the pizza. | close=me @me:.5:crying:idle cam=creep
house | And then I heard a sound. Metal on ice. Scrape. Scrape. | sfx=steps cam=push
house | Somebody was coming down the street. Very slowly. Carrying something. | cam=zoom
house | A shovel. | sfx=sub cam=push
house | Mr. Novak. | close=marley @marley:.5:angry:idle cam=zoom sfx=stinger

== 7
house | Seventy-four years old. In his slippers. Holding a snow shovel like a baseball bat. | @marley:.5:angry:fists+y=150 t=black cam=push
house | marley> [angry] Put the boy down. | close=marley @marley:.5:angry:talk
house | short> [laugh] Or what, grandpa? | close=short @short:.5:grin:talk
house | Bonk. | t=flash sfx=slam cam=shake
house | Lenny went down like a Christmas tree. | cam=down
house | Gus came running out of the house. Still a chicken. Straight onto the ice from the roof. | @tall:.3:shocked:run+to=.6+y=150 cam=right
house | Bonk. | t=flash sfx=slam cam=shake
house | marley> [calm] My son played baseball. I used to pitch to him every Sunday. | close=marley @marley:.5:sad:talk cam=push
street | Five minutes later, the street was full of police cars. | cam=pull sfx=siren fx=flicker
street | The same cop who laughed at me on the phone. | @cop:.5:shocked:idle+y=150 cam=push
street | cop> [quiet] Kid... I owe you an apology. | close=cop @cop:.5:sad:talk
street | They put the Snowmen in the back of a police van. Feathers and all. | cam=right
street | And then a taxi came round the corner. Way too fast. | cam=zoom sfx=whoosh
street | The door flew open before it stopped. | sfx=door cam=push
street | My mum. Still in her airport clothes. Holding her shoes in her hand. | @mum:.4:crying:run+to=.5+y=150 cam=right
street | She'd flown on four planes and a fishing boat to get home. | close=mum @mum:.5:crying:idle cam=push
street | But she stopped in the middle of the street. And looked at the van. | close=mum @mum:.5:shocked:idle cam=zoom
street | mum> [fear] That man. In the back of the police van. ^I know him.^ | close=mum @mum:.5:terrified:talk cam=push sfx=stinger

== 8
street | Mum knew Gus. The tall one. | close=mum @mum:.5:terrified:idle t=black cam=push
street | mum> [quiet] He was our babysitter. Twenty years ago. Before you were born. | close=mum @mum:.5:sad:talk
street | mum> He knew the house. He knew we always went away at Christmas. | close=mum @mum:.5:sad:talk cam=zoom
street | And he knew ^something else.^ | close=tall @tall:.5:smug:idle sfx=sub
street | tall> [laugh] Ask her about the box in the basement, kid. Ask her what's in it. | close=tall @tall:.5:grin:talk cam=push
street | Then the police van drove away. | sfx=siren cam=pull
living | That night, Mum held me so tight I couldn't breathe. I didn't complain. | @mum:.4:crying:hug+y=80 @me:.6:crying:hug+y=80 cam=creep
living | She kept saying sorry. And I kept saying it back. | close=mum @mum:.5:crying:talk
living | But when she fell asleep on the sofa, I went down to the basement. | cam=push
basement | Behind the old stove, there was a box. Taped shut. With a name on it. | cam=zoom fx=dark
basement | | prop=poster:DO_NOT/OPEN:-_for_Ben,_when_he's_ready hold=2.4 sfx=page
basement | For ^me.^ | close=me @me:.5:shocked:idle fx=dark cam=push
basement | Inside were photos. A hospital bracelet. And a letter from a woman I'd never heard of. | prop=photo:MAY_2016 sfx=page
basement | It started with four words. | close=me @me:.5:terrified:idle fx=dark
basement | | prop=note:To_my_son,/I'm_sorry. hold=2.4 sfx=stinger
basement | My mum... wasn't my mum. | close=me @me:.5:crying:idle fx=dark cam=zoom

== 9
basement | I sat in the basement all night. Holding that letter. | close=me @me:.5:crying:idle t=black fx=dark cam=push
basement | Then I heard footsteps on the stairs. | sfx=steps fx=dark cam=up
basement | Max. My big brother. In his pyjamas. | @max:.6:sad:idle+y=60 fx=dark cam=push
basement | max> [quiet] You found it. | close=max @max:.5:sad:talk fx=dark
basement | max> [quiet] I've known for three years. I found it looking for Christmas presents. | close=max @max:.5:sad:talk fx=dark
basement | max> Your real mum was Mum's sister. She was really sick. She made Mum promise to raise you. | close=max @max:.5:sad:talk fx=dark cam=zoom
basement | max> [crying] Why do you think I was always so mean to you? | close=max @max:.5:crying:talk fx=dark
basement | max> I was scared. I thought if you found out... you'd leave. | close=max @max:.5:crying:talk fx=dark
basement | My brother. Who ate my pizza. Who hid my shoes. Was afraid of ^losing me.^ | close=me @me:.5:crying:idle fx=dark cam=push
basement | I gave him the biggest hug of my life. | @max:.45:crying:hug+y=60 @me:.6:crying:hug+y=60 fx=dark cam=creep
basement | Then I asked him the question I'd been afraid to ask. | close=me @me:.5:worried:idle fx=dark
basement | Where did the rest of the family go? The other nine? | close=max @max:.5:sad:idle fx=dark
basement | max> [quiet] Dad's still in Spain. With all of them. Mum couldn't get them home. | close=max @max:.5:sad:talk fx=dark cam=zoom
basement | max> But Ben... Dad isn't coming home. He sent Mum a ^message.^ | close=max @max:.5:sad:talk fx=dark sfx=stinger

== 10
living | The message said: "I'm staying in Spain. I'm sorry. Don't wait for me." | prop=phone:chat:Dad:I'm_staying_in_Spain./I'm_sorry./Don't_wait_for_me. t=black
living | Christmas morning. No presents. No dad. Just me, Max, and Mum. | @mum:.3:sad:sit+y=80 @max:.55:sad:sit+y=80 @me:.78:sad:sit+y=80 cam=creep
living | And I realised something. My family hadn't forgotten me. It had been falling apart for years. | close=me @me:.5:sad:idle cam=push
living | I'd just been too busy fighting about pizza to notice. | close=me @me:.5:smile:idle
street-day | So I went next door. And knocked on Mr. Novak's door. | @me:.4:determined:knock+y=150 cam=right
street-day | I asked him if he'd called his son yet. | close=me @me:.5:determined:idle
street-day | marley> [quiet] It's been twelve years, boy. | close=marley @marley:.5:sad:talk
street-day | So I took out my phone. I'd found his son online that morning. | prop=phone:call:Daniel_Novak:calling...
street-day | He picked up on the second ring. | sfx=buzz cam=zoom
street-day | Mr. Novak cried so hard he had to sit down in the snow. | @marley:.5:crying:sit+y=150 cam=push
living | That night, there was a knock on our door. | sfx=knock cam=push tag=CHRISTMAS_NIGHT
living | It was Mr. Novak. And his son. And his son's two kids. Carrying a pizza. | @marley:.3:smile:wave+y=100 cam=right
living | Cheese. My favourite. | close=me @me:.5:grin:idle cam=zoom
living | We ate it all together on the floor. Seven of us. The best Christmas of my life. | @mum:.2:smile:sit+y=100 @max:.4:grin:sit+y=100 @me:.6:smile:sit+y=100 @marley:.82:smile:sit+y=100 cam=creep
living | And Max let me have the last slice. | close=max @max:.5:smile:idle
house | But on the lawn outside, the next morning, somebody had built a ^snowman.^ | cam=push sfx=sub tag=DECEMBER_26TH
house | The Snowmen were in prison. So who built it? | close=me @me:.5:terrified:idle cam=zoom sfx=stinger
