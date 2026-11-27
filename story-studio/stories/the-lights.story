title: The Lights
id: the-lights
narrator: bm_george
music: synth80s
accent: #ff4a3a
tempo: 1.06

cast:
  me: Sam | kid | hair=side:#3a2414 | top=#2f5f9a:shirt | pants=#3a4a6a | skin=#f6d7bf | voice=am_echo+3
  toby: Toby | kid | hair=bob:#6a4a2a | top=#8a5a3a:jacket | top2=#d8c8a8 | skin=#f6d7bf | voice=am_puck+4
  dash: Dash | kid | hair=cap:#2f6b4a | top=#e8c22a:shirt | skin=#f2c9a8 | voice=am_puck+3
  jay: Jay | kid | hair=buzz:#1a1a1a | top=#c0242c:jacket | skin=#6b4128 | voice=am_echo+2
  nine: Nine | kid | hair=buzz:#5a3a22 | top=#e8eef2:dress | skin=#f2c9a8 | voice=af_sky+2
  mrs: Mrs. Moreno | adult | hair=long:#5a3a22 | top=#a84a3a:sweater | top2=#e9dcc0 | skin=#e8b48f | voice=af_nicole
  chief: Chief Brody | adult | hair=cap:#5a4a2a | top=#8a7a52:uniform | beard=full | build=1.2 | voice=am_onyx
  crane: Dr. Crane | old | hair=side:#e0e0e0 | top=#3a3a40:suit | top2=#f1f1f1 | glasses | voice=bm_lewis
  soldier: Soldier | adult | hair=cap:#3a4a2a | top=#4a5a3a:uniform | voice=am_eric

scenes:
  basement: room wall=#6a5a48:wood floor=#5a3a2a:carpet light=warm | sofa .3 c=#7a5a3a | table .62 | tv .9 | lamp .08
  street: outside sky=night far=pines ground=road | streetlamp .2 | streetlamp .8 | house .5 s=.5 y=-80 c=#a8b8a0
  forest: outside sky=night moon=.7 far=pines ground=grass weather=fog | pine .08 s=1.3 c=#16261e | deadtree .6 s=.9 | pine .92 s=1.4 c=#16261e
  forest-day: outside sky=day far=pines ground=grass light=day | pine .08 s=1.3 c=#2f5a3f | pine .92 s=1.4 c=#2f5a3f
  house: outside sky=night far=pines ground=grass | house .5 s=1.05 c=#b8a88a | pine .06 s=1.1
  living: room wall=#c8b88a:stripes floor=#6a4a2a:wood light=warm | lights .5 v=blink | sofa .5 c=#5a7a5a | lamp .12 | window .85 y=-720
  living-alpha: room wall=#c8b88a:stripes floor=#6a4a2a:wood light=dark | lights .5 v=blink | alphabet .5 | sofa .5 c=#5a7a5a
  living-dark: room wall=#c8b88a:stripes floor=#6a4a2a:wood light=dark | lights .5 v=off | alphabet .5 | sofa .5 c=#5a7a5a
  lab: outside sky=night far=hills ground=asphalt | wall .5 y=-60 s=1.2 c=#9aa0a8 | searchlight .12 | searchlight .88 | sign .5 v=MILLBROOK_LAB y=40
  labin: room wall=#d8e0e4:tile floor=#8a929c:tile light=cold | door .5 s=1.1 v=chain | lamp .15 | lamp .85 | monitors .5 y=-200 s=.5
  station: room wall=#8a7a62:wood floor=#5a4a3a:wood light=warm | desk .5 y=60 | lamp .15 | window .8
  school: room wall=#c8d0d8:tile floor=#8a929c:check light=cold | lockers .5
  quarry: outside sky=day far=hills ground=dirt light=dusk | fence .5 y=40 | police .78
  under: outside sky=red far=ruins ground=dirt weather=dust light=red | deadtree .2 s=1.1 | deadtree .85 s=.9 | house .5 s=.6 y=-60 c=#4a4a4a
  void: void

== 1
living-alpha | In 1986, my best friend disappeared. And his mum talked to him through ^Christmas lights.^ | fx=flicker cam=push @mrs:.5:crying:idle+y=80
basement | Every Saturday, four of us played Dungeons in my basement. Me. Dash. Jay. And Toby. | @me:.2:smile:sit+y=60 @dash:.45:grin:sit+y=60 @jay:.65:smile:sit+y=60 @toby:.85:smile:sit+y=60 tag=NOVEMBER_1986 cam=right
basement | Toby always played the wizard. He was the smallest. And the bravest. | close=toby @toby:.5:smile:idle
basement | toby> [happy] See you tomorrow, guys! Same time! | close=toby @toby:.5:grin:wave
street | He rode home on his bike. Through the woods. Like he did every week. | cam=right tag=10:42_PM
forest | Halfway home, the street lamp above him started to ^flicker.^ | fx=flicker,fog cam=push sfx=buzz
forest | He heard something in the trees. Tall. Breathing. | !hollow:.8:lurk+size=.9+dim fx=fog cam=zoom sfx=whisper
house | He made it home. He locked the door. He called for his mum. She was at work. | cam=push
house | Then every light in the house turned on at once. Brighter. ^Brighter.^ | t=flash fx=flicker sfx=buzz cam=shake
house | And then... nothing. | fx=blackout cam=creep
house | When his mum got home, the front door was open. And Toby was ^gone.^ | cam=zoom sfx=stinger
forest-day | The whole town searched for three days. Police. Dogs. Helicopters. | cam=right sfx=crowd tag=NOVEMBER_7
forest | On the third night, Dash, Jay and I went out on our own. With flashlights. | @me:.25:scared:torch+y=100 @dash:.5:scared:idle+y=100 @jay:.75:determined:idle+y=100 fx=fog cam=push
forest | And in the rain, in the middle of the woods... we found a girl. | cam=zoom sfx=sub
forest | Shaved head. Hospital gown. Bare feet. A tattoo on her wrist. | @nine:.5:scared:idle+y=120 fx=fog cam=push
void | | prop=sign:009:PROPERTY_OF_MILLBROOK_LAB hold=2.0
forest | She looked at the picture of Toby in my hand. | close=nine @nine:.5:blank:idle fx=fog
forest | nine> [whispering] Not dead. Toby is... ^other side.^ | close=nine @nine:.5:scared:talk fx=fog cam=zoom sfx=stinger

== 2
basement | We hid her in my basement. My mum still doesn't know. | @nine:.5:blank:sit+y=60 t=black cam=push
basement | She didn't say much. She didn't know what a TV was. She called herself ^Nine.^ | close=nine @nine:.5:blank:idle
basement | dash> [whispering] Guys. Guys. She just moved my walkie-talkie. Without ^touching^ it. | close=dash @dash:.5:shocked:talk cam=zoom
basement | Then her nose started bleeding. A single drop. | close=nine @nine:.5:pain:idle sfx=sub
house | Across town, Toby's mum hadn't slept in four days. | cam=push
living | And at three in the morning, the lamp next to her ^blinked.^ | @mrs:.5:shocked:idle+y=80 fx=flicker cam=zoom sfx=buzz
living | Once. Twice. Like a heartbeat. | fx=flicker cam=push
living | mrs> [whispering] Toby? Baby? Is that you? | close=mrs @mrs:.5:crying:talk
living | The lamp blinked twice. Yes. | t=flash fx=flicker sfx=buzz
living | So she did something everyone in town called crazy. | close=mrs @mrs:.5:determined:idle
living-alpha | She painted the alphabet on her wall. And hung Christmas lights over every letter. | cam=up
living-alpha | mrs> [crying] Where are you, Toby? Spell it. Please. | close=mrs @mrs:.5:crying:talk
living-alpha | The lights started blinking. One letter at a time. | fx=flicker cam=push sfx=tick
void | | prop=poster:R-I-G-H-T/H-E-R-E hold=2.4
living-alpha | Right here. | close=mrs @mrs:.5:shocked:idle cam=zoom
living-alpha | She asked what she should do. | close=mrs @mrs:.5:terrified:talk
void | | prop=poster:R-U-N hold=1.8 sfx=stinger
living-dark | And then the wallpaper started to ^stretch.^ Like something pushing through from the other side. | !hollow:.5:reach+size=.8 fx=dark cam=shake sfx=stinger

== 3
living-dark | It came through the wall like it was made of rubber. Tall. No face. Just a crack of red light. | !hollow:.55:step+size=.85 t=black fx=dark cam=push
living-dark | Mrs. Moreno ran. Out of the house. Into the street. Screaming. | cam=shake sfx=scream
house | By the time the police came, the wall was normal again. Except for the alphabet. | cam=push
station | Chief Brody. Divorced. Tired. Smokes too much. He thought she'd lost her mind. | @chief:.5:blank:sit+y=40 cam=creep
station | Then a man from the lab called him. Dr. Crane. | prop=phone:call:Millbrook_Lab:connected
station | crane> [calm] Chief, we found the boy's body. In the quarry. I'm so sorry. | close=chief @chief:.5:suspicious:phone+item=phone
station | Too fast. Too clean. Brody had been a cop for twenty years. He didn't ^believe it.^ | close=chief @chief:.5:suspicious:idle cam=zoom
quarry | They pulled a body out of the water the next morning. Small. Covered with a sheet. | cam=push tag=NOVEMBER_10
quarry | We were there. Me, Dash, Jay. Watching from the trees. | @me:.3:crying:idle+y=120 @dash:.5:crying:idle+y=120 @jay:.7:sad:idle+y=120 cam=right
quarry | Jay threw his bike in the dirt. He screamed at Nine. | @jay:.4:angry:point+y=100 @nine:.7:sad:idle+y=100 cam=push
quarry | jay> [angry] You said he was alive! You lied! You're just a ^freak^ from the lab! | close=jay @jay:.5:angry:talk
quarry | Nine didn't cry. She just looked at the body. | close=nine @nine:.5:blank:idle cam=zoom
quarry | nine> [quiet] Not Toby. ^Fake.^ | close=nine @nine:.5:determined:talk
quarry | And the sheet... moved. Just a little. In a wind that wasn't blowing. | cam=zoom sfx=stinger

== 4
station | Brody broke into the morgue that night. | @chief:.5:determined:torch+y=60 fx=dark t=black cam=push
station | He pulled back the sheet. | cam=zoom sfx=creak
station | It wasn't Toby. It was a ^doll.^ Stuffed with cotton. With Toby's clothes. | cam=push sfx=sub
station | chief> [angry] Who the hell fakes a dead kid? | close=chief @chief:.5:angry:talk fx=dark
basement | We went to Toby's funeral anyway. Everybody cried. Except Mrs. Moreno. | cam=creep
basement | That night, in my basement, the walkie-talkie started to crackle. | sfx=buzz cam=push @me:.35:shocked:idle+item=phone+y=60 @dash:.62:scared:idle+y=60
basement | A song. Toby's favourite song. Very quiet. Like from far away. | sfx=whisper cam=zoom
basement | Nine put her hand on the radio. Her nose started bleeding. | close=nine @nine:.5:pain:idle
basement | nine> [whispering] I find him. Show you. | close=nine @nine:.5:determined:talk cam=push
under | And for one second... all of us saw it. | t=flash fx=embers cam=shake
under | My house. My street. But dark. Rotten. Ash floating in the air. | fx=embers cam=right
under | And Toby. Hiding in his own bedroom. In a world that was ^upside down.^ | @toby:.5:terrified:hide+y=100 fx=embers cam=zoom
basement | Nine collapsed. Blood on her lip. | @nine:.5:pain:lie+y=60+size=.9 cam=push
basement | nine> [quiet] The door. Under lab. I made it. I ^opened^ it. | close=nine @nine:.5:crying:talk cam=zoom sfx=stinger

== 5
basement | Nine had opened a door to another world. Because a man told her to. | close=nine @nine:.5:sad:idle t=black cam=push
labin | She was born in the lab. They took her from her mother. | tag=MILLBROOK_LAB cam=creep
labin | Dr. Crane. She called him "Papa". He made her do things with her mind. Every day. | @crane:.4:smile:idle+y=60 @nine:.7:scared:idle+y=60 cam=push
labin | crane> [calm] Reach out, Nine. Find it. Touch it. | close=crane @crane:.5:smile:talk
labin | One day she reached too far. And touched ^something.^ | close=nine @nine:.5:terrified:idle cam=zoom sfx=stinger
labin | It came back with her. And it was hungry. | !hollow:.6:idle+size=.85 fx=red cam=shake
basement | nine> [crying] My fault. Toby. Everything. My fault. | close=nine @nine:.5:crying:talk
basement | I told her: no. It's Crane's fault. Friends don't lie. And I'm not lying. | close=me @me:.5:determined:talk cam=push
basement | She looked at me like nobody had ever said that before. | close=nine @nine:.5:shocked:idle
street | The next morning, a grey van drove past my house. Slowly. | cam=push sfx=steps
street | Then another one. | cam=right
street | Jay went out on his bike to check. He waved at us from the end of the street. | @jay:.8:smile:wave+y=150 cam=zoom
street | Then the van stopped next to him. | cam=push sfx=door
street | And when it drove away... Jay's bike was lying in the street. Wheels still ^spinning.^ | cam=zoom sfx=stinger

== 6
basement | They took Jay to trade him. For Nine. | close=me @me:.5:crying:idle t=black cam=push
basement | | prop=phone:call:Unknown:connected hold=1.2
basement | crane> [calm] Bring her to the lab gate at midnight, Sam. Or your friend goes through the door. | close=me @me:.5:terrified:phone+item=phone
basement | Dash wanted to call the police. But the police chief was the only adult we trusted. | close=dash @dash:.5:worried:talk
station | So we rode to Chief Brody's house. All three of us. Nine on my handlebars. | @chief:.5:shocked:idle+y=80 cam=push
station | chief> [sigh] You kids picked the worst possible man to save the world. | close=chief @chief:.5:sad:talk
station | chief> [calm] But I'm the only one you've got. | close=chief @chief:.5:determined:talk cam=zoom
station | And Mrs. Moreno came too. She was holding a string of Christmas lights. | @mrs:.7:determined:hold+y=80 cam=push
station | mrs> [quiet] If Toby is in there... I'm going in with you. | close=mrs @mrs:.5:determined:talk
lab | Midnight. The lab gate. Searchlights. Soldiers. | cam=up tag=00:00 sfx=siren @soldier:.25:angry:idle+y=60 @soldier:.75:angry:idle+y=60+flip
lab | Dr. Crane walked out. Smiling. Holding Jay by the shoulder. | @crane:.45:smile:idle+y=120 @jay:.6:scared:idle+y=120 cam=push
lab | crane> [calm] Hello, Nine. Come home. | close=crane @crane:.5:smile:talk
lab | Nine took one step forward. Then she stopped. | close=nine @nine:.5:determined:idle cam=zoom
lab | And every searchlight in the lab ^exploded.^ | t=flash sfx=glass fx=blackout cam=shake sfx=stinger

== 7
lab | Darkness. Screaming. Soldiers flying through the air like dolls. | fx=dark,shake t=black cam=shake sfx=crowd @soldier:.3:terrified:hands-up+y=60 @soldier:.7:terrified:run+to=.9+y=80
lab | Nine. Eleven years old. Holding both hands out. Blood running down her face. | @nine:.5:angry:hands-up+y=120+size=1.1 fx=dark cam=push
lab | Jay ran to us. We grabbed him. | @jay:.4:terrified:run+to=.2+y=150 fx=dark cam=left
labin | Brody and Mrs. Moreno ran the other way. Into the lab. Towards the door. | @chief:.3:determined:run+to=.7+torch+y=80 @mrs:.5:determined:run+to=.85+y=80 fx=red cam=right
labin | Down. Down. Six floors under the ground. | cam=down fx=red sfx=alarm
labin | And at the bottom... a hole in the wall. Like a wound. Breathing. | cam=zoom fx=red sfx=whisper
labin | mrs> [calm] Hold my hand, Chief. Don't let go. | close=mrs @mrs:.5:determined:talk fx=red
under | They stepped through. | t=flash fx=embers cam=shake
under | It was our town. Every house. Every tree. But dead. Grey. Ash falling like snow. | fx=embers cam=right
under | And quiet. So quiet you could hear your own ^blood.^ | fx=embers cam=creep sfx=heartbeat
under | They walked to Toby's house. The upside-down version of it. | @chief:.4:scared:walk+to=.5+torch+y=120 @mrs:.6:scared:walk+to=.65+y=120 fx=embers cam=push
under | And in his bedroom, wrapped in black vines... a small body. | fx=embers cam=zoom
under | Toby. Not moving. A vine going ^into his mouth.^ | @toby:.5:blank:lie+y=60+size=.9 fx=embers cam=push sfx=stinger

== 8
under | Mrs. Moreno pulled the vine out of his throat. | @mrs:.45:crying:reach+y=80 @toby:.55:blank:lie+y=60+size=.9 t=black fx=embers cam=push
under | He wasn't breathing. | close=mrs @mrs:.5:crying:idle fx=embers
under | Brody pushed on his chest. Thirty times. Breathe. Thirty times. Breathe. | @chief:.5:determined:crouch+y=80 fx=embers cam=creep sfx=heartbeat
under | chief> [crying] Come on, kid. Come on. Not another one. Not ^another one.^ | close=chief @chief:.5:crying:talk fx=embers
under | Brody had a daughter once. That's all I'll say. | close=chief @chief:.5:crying:idle fx=embers cam=zoom
under | And then Toby coughed. | t=flash sfx=gust cam=shake
under | toby> [crying] Mum? | close=toby @toby:.5:crying:talk fx=embers cam=push
under | Mrs. Moreno screamed so loud the vines on the walls shook. | @mrs:.45:crying:hug+y=80 @toby:.58:crying:hug+y=80 fx=embers cam=creep
under | Then the vines ^moved.^ All of them. At once. Towards the door. | fx=embers,shake cam=shake sfx=stinger
under | Something knew they were here. | !hollow:.85:step+size=.9 fx=embers cam=zoom
school | And on our side, the Hollow came out of the wall of my school. | !hollow:.5:step+size=.85 fx=flicker cam=push t=flash
school | Right in front of us. And Nine. | @nine:.3:determined:hands-up+y=120 @me:.75:terrified:idle+y=120 fx=flicker cam=zoom
school | nine> [quiet] Sam. Goodbye. | close=nine @nine:.5:sad:talk cam=zoom sfx=stinger

== 9
school | Nine said goodbye. Like she already knew. | close=nine @nine:.5:sad:idle t=black cam=push
school | She walked towards it. Hands out. | @nine:.4:determined:hands-up+to=.5+y=120 !hollow:.75:idle+size=.9 fx=flicker cam=right
school | The Hollow screamed. Its face cracked open. Red light poured out. | close=creature !hollow:.5:scream fx=red cam=shake sfx=stinger
school | Nine screamed back. Louder. Blood from her nose. From her ears. | close=nine @nine:.5:angry:talk fx=red cam=shake
school | The lockers bent. The windows burst. The whole school shook. | t=flash sfx=glass cam=shake fx=shake
school | And then the Hollow started to come apart. Like ash. Like smoke. | !hollow:.6:frozen+size=.9 fx=embers cam=zoom
school | And Nine... came apart with it. | fx=embers cam=push sfx=gust
school | When the dust cleared, there was nothing. No monster. No Nine. | cam=pull
school | Just a little puddle of blood on the floor. And a hospital bracelet. | prop=sign:009:PROPERTY_OF_MILLBROOK_LAB sfx=sub
school | I screamed her name until my voice broke. | close=me @me:.5:crying:talk cam=zoom
labin | Under the lab, the door to the other side ^closed.^ | t=flash fx=red sfx=boom cam=shake
labin | Brody and Mrs. Moreno came through the wall a second before it shut. Carrying Toby. | @chief:.4:determined:carry+y=80 @mrs:.65:crying:walk+to=.75+y=80 fx=red cam=right
labin | Toby was home. | close=toby @toby:.5:sleep:idle cam=push
labin | And Nine... was on the ^other side.^ | close=me @me:.5:crying:idle cam=zoom sfx=stinger

== 10
living | Christmas 1986. Toby came home from the hospital. | @toby:.5:smile:sit+y=60 @mrs:.3:smile:idle+y=60 tag=DECEMBER_1986 t=black cam=push
living | The whole town came. Even people who'd called his mum crazy. | cam=right sfx=crowd
living | Dr. Crane disappeared the same night as the Hollow. Nobody knows where. | close=crane @crane:.5:blank:idle
basement | We played Dungeons again. Every Saturday. But there was an empty chair now. | @me:.2:sad:sit+y=60 @dash:.45:sad:sit+y=60 @jay:.65:sad:sit+y=60 @toby:.85:smile:sit+y=60 cam=creep
basement | Nobody sat in it. Ever. | cam=zoom
forest-day | Chief Brody leaves food in a box in the woods. Every week. | @chief:.5:sad:crouch+y=120 cam=push
forest-day | He says it's for the deer. | close=chief @chief:.5:smile:idle
forest-day | But on Monday... the box was ^empty.^ And the lid was folded shut. Neatly. | cam=zoom sfx=sub
house | And Toby. Toby's not the same. | @toby:.5:blank:idle+y=120 cam=push
house | Sometimes he stops in the middle of a sentence. And stares at nothing. | close=toby @toby:.5:blank:idle
house | Last night he was brushing his teeth. He coughed into the sink. | cam=creep
house | Something black and wet came out of his mouth. And crawled down the drain. | cam=zoom sfx=stinger
house | He looked up at me in the mirror. And for one second, his eyes... | close=toby @toby:.5:blank:idle
house | ...were ^upside down.^ | close=toby @toby:.5:creepy:idle cam=zoom fx=flicker
