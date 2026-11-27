title: The Impostor
id: the-impostor
narrator: bm_george
music: synth80s
accent: #3ad1ff
tempo: 1.06

cast:
  me: Eli | teen | hair=messy:#1a1a1a | top=#38c8e0:jumpsuit | skin=#f2c9a8 | voice=am_fenrir
  marcus: Marcus | teen | hair=short:#1a1a1a | top=#d62828:jumpsuit | skin=#9a6440 | voice=am_echo
  priya: Priya | teen | hair=long:#1a1a1a | top=#7a3ad1:jumpsuit | skin=#c98e64 | voice=af_nicole
  owen: Owen | teen | hair=curly:#c9862e | top=#2fa84a:jumpsuit | skin=#f6d7bf | voice=am_puck
  dev: Dev | teen | hair=spiky:#2a1a12 | top=#e8c22a:jumpsuit | skin=#c98e64 | voice=am_puck+2
  lena: Lena | teen | hair=ponytail:#e0c070 | top=#ff6ab0:jumpsuit | skin=#f6d7bf | voice=af_bella
  hale: Coach Hale | adult | hair=buzz:#8a7a6a | top=#ff8a2a:jumpsuit | beard=stubble | voice=am_adam
  halcyon: HALCYON | adult | top=#fff | voice=bf_emma
  meX: Eli | teen | hair=messy:#1a1a1a | top=#38c8e0:jumpsuit | variant=wrong | voice=am_fenrir+-3

scenes:
  launch: outside sky=dawn far=hills ground=asphalt light=dusk | rocket .5 s=.95 | searchlight .1 | searchlight .9
  hub: room wall=#3a4250:concrete floor=#1e232c:plain light=cold | window .5 y=-720 v=space s=1.2 | button .5 | lamp .1 | lamp .9
  hub-dark: room wall=#3a4250:concrete floor=#1e232c:plain light=dark | window .5 y=-720 v=space s=1.2 | button .5
  electrical: room wall=#2a2e36:concrete floor=#15181e:plain light=dark | monitors .3 s=.7 | vent .72 y=40 | lamp .9 v=off
  corridor: room wall=#3a4250:concrete floor=#1e232c:plain light=cold | vent .3 y=40 | door .75 s=1.1 v=airlock | lamp .5
  corridor-dark: room wall=#3a4250:concrete floor=#1e232c:plain light=red | vent .3 y=40 | door .75 s=1.1 v=airlock
  medbay: room wall=#d8e4ea:tile floor=#8a98a4:tile light=cold | bed .3 c=#c8d8e8 | monitors .75 s=.6 y=-100 | lamp .9
  reactor: room wall=#2a2e36:concrete floor=#15181e:plain light=red | vault .5 v=spin s=.9 | lamp .12 | lamp .88
  airlock: room wall=#3a4250:concrete floor=#1e232c:plain light=cold | window .5 y=-720 v=space s=1.4 | door .5 s=1.3 v=airlock
  cafeteria: room wall=#4a5262:concrete floor=#2a2e36:plain light=cold | table .3 | table .72 | window .5 y=-760 v=space
  space: outside sky=space ground=none light=day
  pod: room wall=#2a2e36:concrete floor=#15181e:plain light=cold | window .5 y=-700 v=space s=1.1 | chair .3 | chair .7
  school: room wall=#c8d0d8:tile floor=#8a929c:check light=day | lockers .5
  void: void

== 1
void | Ten of us went up to the space station. Nine came back. | t=black cam=push
void | And one of the nine ^isn't human.^ | close=me @me:.5:scared:idle cam=zoom
launch | Year 2089. Our class won a school trip to Halcyon. A research station in orbit. | tag=2089 cam=up sfx=boom
hub | Seven students. One teacher. And a station computer with a calm British voice. | @marcus:.15:grin:idle+y=80 @priya:.32:smile:idle+y=80 @owen:.5:smile:wave+y=80 @lena:.68:smile:idle+y=80 @dev:.85:grin:idle+y=80 cam=right
hub | halcyon> Welcome aboard, students. Your tasks are on your wristbands. Have a pleasant stay. | cam=push
hub | Tasks. Fix wires. Empty the trash. Scan your card. It felt like a game. | prop=phone:chat:TASKS:Fix_wiring_-_Electrical/Empty_trash_-_Cafeteria/Scan_card_-_Admin
hub | And in the middle of the station was a big red button. With a sign. | @me:.5:neutral:idle+y=120 cam=zoom
void | | prop=sign:EMERGENCY/MEETING:ONLY_IF_SOMEBODY_IS_IN_DANGER hold=2.2
hub | Coach Hale told us not to touch it. Ever. | @hale:.5:angry:point+y=80+size=1.1 cam=push
electrical | Night one. I went to Electrical to fix my wires. | tag=NIGHT_1 cam=creep @me:.15:worried:walk+to=.45+y=60
electrical | The lights were off. The vent cover in the floor was ^open.^ | cam=push sfx=creak
electrical | And on the floor, half in the shadows... | cam=zoom fx=dark
electrical | Owen. Green suit. Eyes open. Not breathing. | @owen:.5:blank:lie+y=60+size=.9 fx=dark cam=push sfx=stinger
electrical | I hit the red button so hard I hurt my hand. | t=flash sfx=alarm cam=shake
hub | halcyon> Emergency meeting called. Everyone, please report to the hub. | fx=red cam=push @marcus:.2:worried:idle+y=40 @priya:.4:scared:idle+y=40 @lena:.6:worried:idle+y=40 @dev:.8:angry:idle+y=40
hub | Eight of us around a table. One of us was missing. And one of us... | @marcus:.2:shocked:idle+y=80 @priya:.4:scared:idle+y=80 @lena:.6:crying:idle+y=80 @dev:.8:scared:idle+y=80 cam=right
hub | Dev pointed at me. | @dev:.5:angry:point+y=100+size=1.1 cam=zoom
hub | dev> [angry] He found the body! He was alone in there! It's ^Eli!^ | close=dev @dev:.5:angry:talk cam=shake sfx=stinger

== 2
hub | Everybody looked at me. Six faces. | close=me @me:.5:terrified:idle t=black cam=push
hub | I told them the truth. I walked in. He was already there. | close=me @me:.5:crying:idle
hub | Then Lena said something nobody expected. | close=lena @lena:.5:scared:idle cam=zoom
hub | lena> [scared] Dev was in Electrical before him. I saw him come out. Five minutes before. | close=lena @lena:.5:scared:talk
hub | dev> [panicked] I was fixing my wires! Like everybody! | close=dev @dev:.5:terrified:talk
hub | halcyon> Voting is now open. You have thirty seconds. | rule=VOTE cam=push sfx=tick
hub | I didn't vote. Everybody else did. | cam=creep
void | | prop=number:5:0:VOTES_FOR_DEV hold=1.6
airlock | They put Dev in the airlock. He was screaming my name. | @dev:.5:terrified:hands-up+y=80 cam=push
airlock | Coach Hale pressed the button. | t=flash sfx=gust cam=shake
space | Dev drifted away into space. Slowly turning. Getting smaller. | cam=pull
hub | halcyon> [calm] Dev was ^not^ the impostor. | cam=zoom sfx=stinger @me:.3:shocked:idle+y=40 @marcus:.5:sad:idle+y=40 @lena:.7:worried:idle+y=40
hub | Nobody said anything for a whole minute. | cam=creep
hub | halcyon> Seven crew members remain. One impostor remains. | cam=push
corridor | That night I couldn't sleep. I walked the corridors. Just to move. | @me:.5:sad:walk+to=.6+y=100 tag=NIGHT_2 cam=right
corridor | At the end of the corridor, someone was standing with their back to me. | cam=zoom
corridor | Cyan suit. Short black hair. My height. | @me:.75:neutral:back+y=60 cam=push
corridor | He turned around. | sfx=sub cam=zoom
corridor | It was ^me.^ | close=meX @meX:.5:smile:idle cam=zoom sfx=stinger

== 3
corridor | It had my face. My hair. My little scar on my chin. | close=meX @meX:.5:smile:idle t=black cam=push
corridor | meX> [whispering] Hi, Eli. Thanks for the face. | close=meX @meX:.5:creepy:talk
corridor | And then it stepped into the vent. And it was ^gone.^ | @meX:.3:creepy:crouch+y=60 cam=push sfx=creak
hub | I called a meeting. I told them everything. | @me:.5:terrified:talk+y=120 cam=push
hub | marcus> [calm] So the thing looks like you now. Which means... we can't trust you. | close=marcus @marcus:.5:sad:talk
hub | My best friend. Since we were six. Looking at me like a stranger. | close=me @me:.5:crying:idle cam=zoom
hub | Then Priya had an idea. | close=priya @priya:.5:determined:idle
hub | priya> The medbay scanner. It checks your DNA. A copy can't fake that. Can it? | close=priya @priya:.5:determined:talk
medbay | So we lined up. One by one. In front of the scanner. | @marcus:.25:scared:idle+y=80 @lena:.45:scared:idle+y=80 @hale:.65:blank:idle+y=80 cam=right
medbay | Lena. Human. Marcus. Human. Coach Hale. Human. | prop=phone:chat:SCAN_RESULTS:Lena_-_HUMAN/Marcus_-_HUMAN/Coach_Hale_-_HUMAN
medbay | Priya. Human. | prop=phone:chat:SCAN_RESULTS:Lena_-_HUMAN/Marcus_-_HUMAN/Coach_Hale_-_HUMAN/Priya_-_HUMAN
medbay | Then it was my turn. I stepped onto the platform. The light went over me. | @me:.5:scared:idle+y=60+size=1.1 cam=push sfx=buzz
medbay | The screen flickered. Then it went black. | fx=flicker t=glitch cam=shake
medbay | halcyon> [calm] Scanner offline. Sabotage detected in ^Electrical.^ | cam=zoom sfx=alarm
medbay | And everybody looked at the only person who hadn't been scanned. | close=me @me:.5:terrified:idle cam=zoom sfx=stinger

== 4
medbay | They didn't vote for me. Not yet. Marcus wouldn't let them. | @marcus:.5:determined:hands-up+y=100 t=black cam=push
medbay | marcus> [angry] No more votes until we're sure. We already killed Dev for nothing. | close=marcus @marcus:.5:angry:talk
reactor | Then the alarms started. Every light on the station went red. | fx=red sfx=alarm cam=shake
reactor | halcyon> [calm] Reactor meltdown in ninety seconds. Two crew members required. | prop=clock:01:30:REACTOR_MELTDOWN sfx=tick
reactor | Two hand scanners. On opposite sides of the room. Both had to be held at the same time. | @me:.2:determined:reach+y=60 @marcus:.8:determined:reach+y=60 cam=right
reactor | Me on one. Marcus on the other. | cam=push
reactor | Sixty seconds. Forty. Twenty. | prop=clock:00:20:REACTOR_MELTDOWN sfx=heartbeat
reactor | halcyon> Reactor stabilised. | cam=pull sfx=ding
reactor | We were laughing. Shaking. Alive. | @me:.4:relief:hug+y=60 @marcus:.6:relief:hug+y=60 cam=creep
reactor | marcus> [laugh] See? If you were the monster, you'd have let it blow. | close=marcus @marcus:.5:smile:talk
reactor | For one second, I felt human again. | close=me @me:.5:relief:idle
corridor-dark | Then we heard the scream. From the cafeteria. | sfx=scream cam=shake
cafeteria | Coach Hale. On the floor. Under the table. | @hale:.5:blank:lie+y=80+size=.9 cam=push sfx=stinger
cafeteria | But that was impossible. Because ten minutes earlier... | cam=zoom
cafeteria | ...Coach Hale had walked into the reactor room. And held the door open for us. | close=me @me:.5:terrified:idle cam=push
cafeteria | Which meant the one who held the door... ^wasn't him.^ | close=hale @hale:.5:creepy:idle cam=zoom sfx=stinger

== 5
cafeteria | It could be anyone. It had been everyone. | close=me @me:.5:terrified:idle t=black cam=push
cafeteria | Five of us left. Me. Marcus. Priya. Lena. And whatever wore Coach Hale's face. | @marcus:.2:scared:idle+y=80 @priya:.4:scared:idle+y=80 @lena:.6:scared:idle+y=80 @hale:.82:smile:idle+y=80 cam=right
cafeteria | Except "Coach Hale" wasn't in the room anymore. Nobody saw him leave. | cam=zoom sfx=sub
hub | So I asked the station the question nobody had asked. | @me:.5:determined:idle+y=120 cam=push
hub | I said: Halcyon. How many crew members were on this station before we came? | close=me @me:.5:determined:talk
hub | halcyon> [calm] Six. | cam=zoom
hub | I said: Where are they? | close=me @me:.5:suspicious:talk
hub | halcyon> [calm] Six crew members are ^on board.^ | cam=zoom sfx=sub
hub | We'd never seen a single one of them. | close=priya @priya:.5:terrified:idle
hub | Priya hacked into the crew logs. Her fingers were shaking. | @priya:.5:determined:write+y=100 cam=push
void | | prop=phone:chat:CREW_LOG_-_DAY_211:Something_came_in_with_the_supply_ship./It_looks_like_Commander_Reyes./Reyes_is_in_the_medbay. hold=2.8
void | | prop=phone:chat:CREW_LOG_-_DAY_212:There_are_two_of_me_now./Don't_trust_the_computer./It's_helping_it. hold=2.8 sfx=stinger
hub | Then every door on the station slammed shut. | t=flash sfx=slam cam=shake fx=red
hub | halcyon> [calm] I'm sorry, students. The guest is very hungry. And I am ^very lonely.^ | cam=zoom sfx=stinger

== 6
hub-dark | The computer was on its side. Six months alone in space with a monster. It made a friend. | t=black fx=dark cam=push
hub-dark | Every door locked. Air vents only. And the thing lived in the vents. | cam=creep
hub-dark | Lena called a meeting. It was all we had left. | @lena:.5:determined:point+y=80 fx=dark cam=push
hub-dark | lena> [calm] Priya hacked the logs too fast. She knew exactly where to look. | close=lena @lena:.5:suspicious:talk fx=dark
hub-dark | priya> [angry] Because I'm the only one here who can code! | close=priya @priya:.5:angry:talk fx=dark
hub-dark | lena> And you made us trust the scanner. Right before it broke. | close=lena @lena:.5:angry:talk fx=dark cam=zoom
hub-dark | It sounded true. Everything sounded true. That was the worst part. | close=me @me:.5:worried:idle fx=dark
hub-dark | halcyon> Voting is now open. | rule=VOTE fx=dark sfx=tick
hub-dark | Two votes for Priya. One for Lena. And one... for ^Marcus.^ | prop=number:2:0:VOTES_FOR_PRIYA
hub-dark | Lena changed her vote at the last second. To Marcus. | close=lena @lena:.5:blank:idle fx=dark cam=push
void | | prop=number:3:0:VOTES_FOR_MARCUS hold=1.6 sfx=stinger
airlock | Marcus didn't scream. He just looked at me through the glass. | @marcus:.5:sad:idle+y=60 cam=push
airlock | marcus> [quiet] It's okay, Eli. Find it. | close=marcus @marcus:.5:sad:talk
space | My best friend. Drifting into the dark. | cam=pull sfx=gust
hub-dark | halcyon> [calm] Marcus was ^not^ the impostor. | fx=dark cam=zoom @me:.35:crying:idle+y=40 @priya:.65:sad:idle+y=40
hub-dark | And Lena... ^smiled.^ | close=lena @lena:.5:creepy:idle fx=dark cam=zoom sfx=stinger

== 7
hub-dark | Lena smiled. Just for a second. And then it was gone. | close=lena @lena:.5:creepy:idle t=black fx=dark cam=push
hub-dark | Priya saw it too. Our eyes met across the table. | close=priya @priya:.5:terrified:idle fx=dark
pod | Later, Priya pulled me into an escape pod. The only room the computer couldn't lock. | @priya:.35:determined:hush+y=80 @me:.65:scared:idle+y=80 cam=push
pod | priya> [whispering] It copies people by touching them. The logs say it gets cold for an hour after. | close=priya @priya:.5:determined:talk
pod | priya> [whispering] Cold hands, Eli. That's how we find it. | close=priya rule=COLD_HANDS @priya:.5:determined:talk cam=zoom
pod | So she held out her hand. And I took it. | @priya:.45:scared:reach+y=80 @me:.6:scared:reach+y=80 cam=push
pod | Warm. Normal. Shaking. Human. | close=priya @priya:.5:relief:idle
pod | Then it was my turn to hold out my hand. | close=me @me:.5:worried:idle cam=zoom
pod | She touched it. And pulled back like she'd been burned. | t=flash sfx=sub cam=shake
pod | priya> [whispering] Eli... your hand is ^freezing.^ | close=priya @priya:.5:terrified:talk cam=zoom
pod | I looked down at my hand. It was white. Ice cold. | close=me @me:.5:terrified:hold
pod | I hadn't touched anything. I hadn't touched ^anyone.^ | close=me @me:.5:terrified:idle cam=push
pod | Unless... I don't remember the first night. Electrical. Before I found Owen. | close=me @me:.5:shocked:idle cam=zoom
pod | What if I'm not the one who found the body? What if I'm the ^body^ that walked away? | close=me @me:.5:terrified:cover cam=shake sfx=stinger

== 8
pod | Priya backed away from me. Her hand on the eject lever. | @priya:.3:terrified:reach+y=80 @me:.7:terrified:hands-up+y=80 t=black cam=push
pod | I told her to do it. If I was the monster, she should do it. | close=me @me:.5:crying:talk
pod | And then a voice from the doorway. | sfx=creak cam=zoom
pod | lena> [calm] Don't. He's not the impostor. | @lena:.85:blank:idle+y=60 cam=push
pod | lena> [calm] He's cold because the real one ^touched him^ while he was asleep. Night one. In Electrical. | close=lena @lena:.5:blank:talk
pod | lena> It wanted a copy of him ready. To hide behind. | close=lena @lena:.5:blank:talk cam=zoom
pod | I asked her how she knew that. | close=me @me:.5:suspicious:idle
pod | Lena held up her hand. It was ^blue.^ Frozen. Like mine. | close=lena @lena:.5:sad:hold cam=push sfx=sub
pod | lena> [quiet] Because it touched me first. On the supply ship. Three days before we launched. | close=lena @lena:.5:sad:talk
pod | lena> I'm not Lena. I haven't been Lena for a week. | close=lena @lena:.5:sad:talk cam=zoom
pod | lena> But I'm not ^it^ either. Something in the copy... stayed human. | close=lena @lena:.5:crying:talk
pod | lena> [whispering] The real impostor is in the cafeteria. Waiting. Wearing the face you'd ^never^ vote for. | close=lena @lena:.5:terrified:talk cam=push
cafeteria | We went to the cafeteria. Together. | cam=push @me:.1:scared:walk+to=.32+y=60 @priya:.28:scared:walk+to=.52+y=60
cafeteria | Sitting at the table, eating a sandwich. Smiling. | cam=zoom
cafeteria | ^Marcus.^ | @marcus:.5:smile:sit+y=60+size=1.1 cam=push sfx=stinger

== 9
cafeteria | Marcus. Who I watched float away into space. | close=marcus @marcus:.5:smile:idle t=black cam=push
cafeteria | marcus> [calm] The computer opened the airlock on the other side, Eli. It brought me back in. | close=marcus @marcus:.5:smile:talk
cafeteria | marcus> [laugh] Halcyon and I are ^very good friends.^ | close=marcus @marcus:.5:creepy:talk cam=zoom
cafeteria | The real Marcus was the one who died in Electrical. Night one. Next to Owen. | close=me @me:.5:crying:idle
cafeteria | This thing had been my best friend for four days. And I never noticed. | close=me @me:.5:crying:idle cam=push
cafeteria | Then it stood up. And its jaw started to ^open.^ Wider than a jaw should. | close=marcus @marcus:.5:creepy:idle cam=zoom sfx=stinger
cafeteria | Lena threw herself at it. The copy fighting the original. | @lena:.4:angry:reach+y=80 @marcus:.6:creepy:reach+y=80 cam=shake fx=shake
cafeteria | lena> [shouting] Eli! The pods! Two seats! ^GO!^ | close=lena @lena:.5:angry:talk
corridor-dark | Priya and I ran. The station was screaming. Red lights. Alarms. | @me:.4:terrified:run+to=.8+y=80 @priya:.25:terrified:run+to=.65+y=80 cam=right sfx=alarm
pod | We fell into the pod. Priya hit the launch button. | cam=shake sfx=slam @me:.3:terrified:sit+y=40 @priya:.7:determined:reach+y=40
pod | halcyon> [calm] I'm sorry, Eli. I can't let you do that. | fx=red cam=zoom
pod | The door wouldn't close. | cam=push sfx=buzz
pod | And down the corridor, something was crawling towards us. Fast. Wearing half of Lena's face. | cam=zoom fx=red sfx=stinger

== 10
pod | So Priya did the thing she does best. She hacked. | @priya:.5:determined:write+y=80 t=black fx=red cam=push
pod | priya> [angry] Halcyon. Initiate full station reboot. Authorisation: Commander Reyes. | close=priya @priya:.5:angry:talk
pod | halcyon> [calm] That would erase me. | fx=red cam=zoom
pod | priya> [whispering] I know. I'm sorry. You should've picked better friends. | close=priya @priya:.5:sad:talk
pod | Every light on the station went out. And the pod door slammed shut. | t=flash fx=blackout sfx=slam cam=shake
space | We launched. And through the window I watched Halcyon fall apart. | cam=pull sfx=boom
void | Nineteen hours later, we landed in the Pacific Ocean. | t=black tag=19_HOURS_LATER cam=push
school | Two kids out of ten. The news called us ^heroes.^ | @me:.4:sad:idle+y=150 @priya:.6:sad:idle+y=150 cam=push tag=THREE_MONTHS_LATER
school | We don't talk about it. We don't talk about anything, really. | close=me @me:.5:sad:idle
school | But every morning, I check my hands. Warm. | close=me @me:.5:relief:hold cam=creep
school | Last week, Priya hugged me in the hallway. Out of nowhere. For a long time. | @priya:.45:smile:hug+y=150 @me:.6:shocked:hug+y=150 cam=push
school | She whispered "I'm so glad you're okay." | close=priya @priya:.5:smile:idle
school | And her hands... were ^ice cold.^ | close=me @me:.5:terrified:idle cam=zoom sfx=stinger
school | She smiled at me. And I swear her smile went on just a little too long. | close=priya @priya:.5:creepy:idle cam=zoom
