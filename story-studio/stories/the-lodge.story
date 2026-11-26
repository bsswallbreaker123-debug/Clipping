title: The Lodge
id: the-lodge
narrator: bm_george
music: eerie
accent: #7ad0ff
tempo: 1.06

cast:
  me: Nora | teen | hair=long:#3a2414 | top=#2f6b8a:jacket | top2=#e9e6df | skin=#f2c9a8 | voice=af_nicole
  ethan: Ethan | teen | hair=side:#1a1a1a | top=#3a3a40:hoodie | skin=#e8b48f | voice=am_echo
  kyle: Kyle | teen | hair=spiky:#c9a063 | top=#c0242c:jacket | top2=#f1f1f1 | build=1.15 | voice=am_adam
  megan: Megan | teen | hair=ponytail:#e0c070 | top=#e86a9a:coat | skin=#f6d7bf | voice=af_bella
  tom: Tom | teen | hair=curly:#2a1a12 | top=#5a7a3a:sweater | top2=#e9dcc0 | glasses | skin=#9a6440 | voice=am_puck
  lily: Lily | teen | hair=long:#1a1a1a | top=#7a3a8a:sweater | skin=#f2c9a8 | voice=af_sky
  lilyW: Lily | teen | hair=long:#1a1a1a | top=#5a4a5a:sweater | variant=wrong | voice=af_sky+-4
  trapper: The Stranger | old | hair=beanie:#5a3a22 | beard=full | top=#6a5a3a:coat | wrinkles | voice=am_onyx
  cop: Detective | adult | hair=side:#3a2a1a | top=#3a3a40:suit | top2=#f1f1f1 | voice=bm_lewis

scenes:
  cable: outside sky=snow moon=.8 far=alps ground=snow weather=snow | pine .1 s=1.2 | pine .9 s=1.1 | streetlamp .5
  lodge: outside sky=snow moon=.75 far=alps ground=snow weather=snow | chalet .5 s=1.15 c=#4a3020 | pine .05 s=1.2 | pine .95 s=1.15
  lodge-dark: outside sky=storm far=alps ground=snow weather=snow light=dark | chalet .5 s=1.15 c=#4a3020 v=dark | pine .05 s=1.2 | pine .95 s=1.15
  inside: room wall=#5a3a26:wood floor=#3a2416:wood beams light=warm | fireplace .78 | sofa .3 c=#7a2a24 | window .3 y=-760 | rug .4 | picture .55
  inside-dark: room wall=#5a3a26:wood floor=#3a2416:wood beams light=dark | fireplace .78 | sofa .3 c=#7a2a24 | window .3 y=-760 v=curtain:#5a2a1a
  hallway: room wall=#5a3a26:wood floor=#3a2416:wood light=dark | door .5 s=1.2 | picture .15 | picture .85
  bedroom: room wall=#6a4a32:wood floor=#3a2416:wood light=moon | bed .35 c=#2f5f6a | window .75 v=curtain:#3a5a6a
  forest: outside sky=snow moon=.3 far=pines ground=snow weather=snow | pine .08 s=1.3 | deadtree .6 s=.9 | pine .92 s=1.4
  forest-dark: outside sky=storm far=pines ground=snow weather=snow light=dark | pine .08 s=1.3 | deadtree .6 s=.9 | pine .92 s=1.4 | footprints .5
  mine-ext: outside sky=snow moon=.8 far=alps ground=snow weather=snow | cave .5 s=1.05 | pine .05 s=1.1
  mine: room wall=#3a3436:stone floor=#2a2628:plain light=dark floorY=1420 | lamp .2 v=off | lamp .8 v=off
  cabin: room wall=#4a3a2a:wood floor=#2a2016:wood light=warm | stove .8 c=#3a3a3a | table .35 | candles .35 y=-275 s=.5 v=1 | books .1
  station: room wall=#cfd4da:plain floor=#7a8088:tile light=cold | desk .5 y=60 | lamp .15 | window .82 v=day
  void: void

== 1
void | One year ago, two sisters ran out of a mountain lodge into a ^snowstorm.^ | t=black cam=push
lodge | Lily and Rose Carter. Sixteen and seventeen. They were never found. | cam=zoom fx=snow
inside | It was our fault. All of us. We played a prank on Lily that night. A stupid one. | @kyle:.2:grin:idle+y=60 @megan:.45:grin:idle+y=60 @tom:.7:worried:idle+y=60 cam=right tag=ONE_YEAR_AGO
inside | She ran out crying. Her sister ran after her. And the storm took them both. | cam=push sfx=gust
cable | This year, their brother Ethan invited us back. To the same lodge. On the same night. | @ethan:.5:smile:wave+y=150 cam=push tag=TONIGHT
cable | ethan> One year. I don't want to be angry anymore. Let's remember them together. | close=ethan @ethan:.5:sad:talk
cable | So we came. Me. Kyle. Megan. Tom. Everybody who was there that night. | @me:.2:sad:idle+y=150 @kyle:.4:neutral:idle+y=150 @megan:.6:worried:idle+y=150 @tom:.8:scared:idle+y=150 cam=right
cable | The only way up is a cable car. It stops running at ^midnight.^ | rule=LAST_CAR_00:00 cam=up
lodge | The lodge looked exactly the same. Like it had been waiting for us. | cam=push sfx=creak
inside | Ethan made a fire. Hot chocolate. Old photos of the sisters on the table. | @ethan:.6:smile:hold+cup+y=60 cam=creep
inside | Everybody was trying so hard to be normal. | @kyle:.25:smile:sit+y=40 @megan:.45:smile:sit+y=40 @me:.75:sad:idle+y=60 cam=push
inside | Then Tom found something carved into the doorframe. | @tom:.5:shocked:point+y=60 cam=zoom
void | | prop=sign:DON'T/MOVE:-_R. hold=2.2 sfx=page
inside | "Don't move." And an R. Like Rose. | close=tom @tom:.5:terrified:idle
inside | ethan> [calm] That wasn't there last year. | close=ethan @ethan:.5:blank:talk cam=zoom
inside | At eleven fifty, my phone buzzed. A notification. From a number I'd deleted a year ago. | sfx=buzz cam=push tag=11:50_PM
inside | | prop=phone:notify:Lily_Carter:23:50/I'm_still_here. hold=2.4
inside | ^Lily.^ | close=me @me:.5:terrified:phone+item=phone cam=zoom sfx=stinger

== 2
inside | A message. From a girl who'd been missing for a year. | close=me @me:.5:terrified:phone+item=phone t=black cam=push
inside | "I'm still here." Sent ^two minutes ago.^ | prop=phone:notify:Lily_Carter:23:52/I'm_still_here.
inside | Everybody went quiet. Ethan read it three times. | close=ethan @ethan:.5:shocked:idle
inside | ethan> [fear] Her phone. It's on. She's alive. She has to be alive! | close=ethan @ethan:.5:crying:talk cam=zoom
inside | Kyle said it was a sick joke. Megan said call the police. | @kyle:.3:angry:point+y=60 @megan:.7:scared:phone+item=phone+y=60 cam=right
inside | No signal. Of course. | prop=phone:notify:No_Service:23:54/ sfx=click
cable | And at midnight, the last cable car left the mountain. ^Empty.^ | cam=pull tag=00:00 sfx=gust
inside | Ethan wanted to search. Right now. In the dark. | @ethan:.5:determined:torch+lantern+y=60 cam=push
inside | So we split up. Two and two. The worst idea in every movie ever. | @kyle:.2:neutral:idle+y=60 @megan:.4:scared:idle+y=60 @tom:.6:scared:idle+y=60 @me:.8:worried:idle+y=60 cam=right
forest | I went with Tom. Kyle went with Megan. Ethan went alone. | @me:.35:scared:torch+y=120 @tom:.65:scared:idle+y=120 cam=right
forest | Forty minutes. Nothing. Just snow and trees and our own breath. | cam=creep sfx=gust
forest | Then we found a second carving. On a tree. | @tom:.6:shocked:point+y=120 cam=push
void | | prop=sign:THEY_ONLY/SEE_YOU/WHEN_YOU/MOVE:-_R. hold=2.6
forest | tom> [whispering] Nora... who's "they"? | close=tom @tom:.5:terrified:talk
forest | And somewhere behind us, from the direction of the lodge... | cam=zoom
forest | Megan ^screamed.^ | t=flash sfx=scream cam=shake

== 3
forest-dark | We ran back through the trees. My flashlight shaking so hard I couldn't see. | @me:.3:terrified:run+to=.7+torch+y=120 t=black cam=right
lodge-dark | Kyle was on the porch. Covered in snow. Alone. | @kyle:.5:terrified:idle+y=150 cam=push
lodge-dark | kyle> [crying] Something took her. It came out of the trees. It was so ^tall.^ | close=kyle @kyle:.5:crying:talk
lodge-dark | kyle> It went up. Into the trees. With her. | close=kyle @kyle:.5:terrified:talk cam=zoom
lodge-dark | Then a light came out of the forest. An old man. With a rifle and a lantern. | @trapper:.5:determined:hold+lantern+y=120 cam=push sfx=steps
lodge-dark | trapper> [angry] Get inside. All of you. ^Now.^ | close=trapper @trapper:.5:angry:talk
inside-dark | He barricaded the door with the sofa. Then he sat down by the fire. | @trapper:.6:blank:sit+lantern+y=60 cam=creep
inside-dark | trapper> [calm] You kids ever heard of a wendigo? | close=trapper @trapper:.5:blank:talk
inside-dark | trapper> In a hard winter, somebody starving does something they shouldn't. To survive. | close=trapper @trapper:.5:sad:talk
inside-dark | trapper> They eat... someone. And the mountain ^changes them.^ | close=trapper @trapper:.5:blank:talk cam=zoom
void | This is a ^Wendigo.^ | card=Wendigo:The_Hunger_Spirit_-_North_America:5 !wendigo:.5:idle
forest-dark | Nine feet tall. Fast. Always hungry. But it has one weakness. | !wendigo:.5:idle+size=1.1 cam=up
forest-dark | trapper> They only see you when you move. Stand still... and you're invisible. | close=trapper rule=RULE_#1 @trapper:.5:determined:talk
inside-dark | Then a sound. Up on the roof. Footsteps. Big ones. | sfx=steps cam=up fx=dark
inside-dark | trapper> [whispering] Nobody. Moves. | close=trapper @trapper:.5:terrified:hush cam=zoom
inside-dark | The chimney ^crashed in.^ | t=flash sfx=slam cam=shake fx=embers
inside-dark | And something unfolded itself out of the fireplace. Right in front of us. | !wendigo:.75:crawl+size=.9 fx=dark,embers cam=push sfx=stinger

== 4
inside-dark | Don't move. Don't breathe. Don't blink. | rule=DON'T_MOVE t=black fx=dark cam=push
inside-dark | It stood up. Its head touched the ceiling. | !wendigo:.7:idle+size=.85 fx=dark cam=up
inside-dark | It walked between us. Slowly. Sniffing. | !wendigo:.75:step+to=.45+size=.85 @me:.2:terrified:idle+y=80 @tom:.88:terrified:idle+y=80 fx=dark cam=right sfx=steps
inside-dark | It stopped in front of me. Its face was a skull. With ^antlers.^ | close=creature !wendigo:.5:idle fx=dark cam=zoom
inside-dark | I could smell it. Frozen meat and wet fur. | close=me @me:.5:terrified:idle fx=dark
inside-dark | Then I felt something run down my cheek. A tear. | close=me @me:.5:crying:idle fx=dark cam=creep
inside-dark | Does a tear count as moving? | close=me @me:.5:terrified:idle fx=dark cam=zoom sfx=heartbeat
inside-dark | Its head tilted. Closer. | close=creature !wendigo:.5:idle fx=dark sfx=whisper
inside-dark | And then Tom sneezed. | t=flash cam=shake sfx=slam
inside-dark | It turned faster than anything I've ever seen. | !wendigo:.6:reach+size=.85 fx=dark cam=shake
inside-dark | But Kyle got there first. He shoved Tom aside and ran for the door. Waving his arms. Screaming. | @kyle:.4:angry:run+to=.05+y=60 fx=dark cam=left
inside-dark | kyle> [angry] HEY! ^HEY!^ Over here! | close=kyle @kyle:.5:angry:talk fx=dark
lodge-dark | It followed him out into the snow. | !wendigo:.4:step+to=.1+size=.9 cam=left sfx=gust
lodge-dark | Then the trees went quiet. | cam=creep
inside-dark | We waited. A minute. Two. | fx=dark cam=creep sfx=tick
inside-dark | And then the front door slowly opened. | sfx=creak cam=push fx=dark
inside-dark | It wasn't Kyle. It was a man in a black mask... with a ^knife.^ | @ethan:.5:blank:idle+y=100+dim fx=dark cam=zoom sfx=stinger

== 5
inside-dark | The man in the mask pulled it off. | t=black fx=dark cam=push
inside-dark | It was Ethan. | close=ethan @ethan:.5:shocked:idle fx=dark
inside-dark | ethan> [panicked] It was a prank. All of it. The message from Lily. The carvings. Me. | close=ethan @ethan:.5:terrified:talk fx=dark
inside-dark | ethan> I wanted you to feel what she felt. Just for one night. | close=ethan @ethan:.5:crying:talk fx=dark cam=zoom
inside-dark | ethan> [crying] But I didn't... I didn't make ^that thing.^ | close=ethan @ethan:.5:crying:talk fx=dark
inside-dark | He'd planned a fake killer. He hadn't planned a real monster. | close=me @me:.5:angry:idle fx=dark cam=push
inside-dark | trapper> [calm] Your sisters. Where did they go that night? | close=trapper @trapper:.5:suspicious:talk fx=dark
inside-dark | ethan> They found their phones near the old mine. That's all we ever found. | close=ethan @ethan:.5:sad:talk fx=dark
inside-dark | The old man closed his eyes. | close=trapper @trapper:.5:sad:idle fx=dark cam=zoom
inside-dark | trapper> [sad] Then they went down. And a girl alone in a mine... for a whole winter... | close=trapper @trapper:.5:sad:talk fx=dark
mine-ext | We went to the mine at sunrise. Me and Ethan. The others stayed with the stranger. | @me:.4:scared:walk+to=.5+y=120 @ethan:.6:scared:walk+to=.65+y=120 cam=push tag=6:10_AM
mine | Inside, on a rock, was a diary. Lily's. Frozen. | cam=creep fx=dark
mine | | prop=note:Day_31./Rose_didn't_wake_up./I'm_so_hungry. hold=2.6 sfx=page
mine | Ethan turned the page. His hands were shaking. | close=ethan @ethan:.5:terrified:hold+letter fx=dark
mine | | prop=note:Day_40./I'm_sorry,_Rose./I_had_to. hold=2.6 sfx=stinger
mine | ethan> [whispering] No. No, no, no. ^Not Lily.^ | close=ethan @ethan:.5:crying:talk fx=dark cam=zoom

== 6
mine | The thing that took Megan. The thing in the fireplace. | close=ethan @ethan:.5:crying:idle t=black fx=dark cam=push
mine | It was Lily. His little sister. | close=me @me:.5:terrified:idle fx=dark cam=zoom
mine | And she'd been sending messages from her own phone. Not Ethan. Her. | prop=phone:notify:Lily_Carter:06:22/I'm_still_here./Come_down.
mine | ^Come down.^ | close=ethan @ethan:.5:shocked:phone+item=phone fx=dark sfx=sub
mine | Ethan stood up. And walked deeper into the mine. | @ethan:.5:sad:walk+to=.9+y=80 fx=dark cam=right
mine | ethan> [quiet] She's still my sister, Nora. Maybe some part of her remembers. | close=ethan @ethan:.5:sad:talk fx=dark
mine | I begged him to stop. He didn't even turn around. | close=me @me:.5:crying:idle fx=dark cam=push
mine | His flashlight got smaller. And smaller. And then it was gone. | cam=zoom fx=dark sfx=gust
lodge | I ran back to the lodge alone. I told them everything. | @me:.5:crying:run+to=.5+y=150 cam=push
inside | trapper> [calm] Then tonight she'll come for the rest of you. She remembers ^every face^ from that prank. | close=trapper @trapper:.5:determined:talk
inside | Megan's coat was found on the porch an hour later. Folded. Neat. | cam=creep
inside | Like a message. | cam=zoom sfx=sub
inside | And in the pocket... Megan's phone. With a video on it. | prop=phone:camera:REC_-_02:14 sfx=buzz
inside | Twelve seconds. Megan. In the dark. Alive. Whispering. | prop=phone:camera:REC_-_02:14 cam=push
inside | megan> [whispering] There are two of them. Nora... ^there are two.^ | prop=phone:camera:REC_-_02:14 cam=zoom sfx=stinger

== 7
inside | Two wendigos. Lily. And... Rose? But Rose was dead. Lily wrote it. | close=me @me:.5:terrified:idle t=black cam=push
inside | Unless Lily lied in her own diary. | close=me @me:.5:suspicious:think
inside | trapper> [quiet] Or unless the second one is somebody who came looking for them last winter. | close=trapper @trapper:.5:sad:talk
inside | trapper> Somebody who got lost. And hungry. | close=trapper @trapper:.5:blank:talk cam=zoom
inside | He took off his glove. His fingers were black. Frostbite. Or something worse. | close=trapper @trapper:.5:sad:idle sfx=sub
inside | trapper> [calm] I've been fighting it for a year. Every night it gets ^harder.^ | close=trapper @trapper:.5:terrified:talk cam=push
inside | The man protecting us... was turning into one. | close=me @me:.5:terrified:idle cam=zoom
inside | trapper> So listen. The lodge has a gas line. Old. Big. | close=trapper @trapper:.5:determined:talk
inside | trapper> At dawn, I lead them inside. You kids get out. And then somebody lights a ^match.^ | close=trapper rule=THE_PLAN @trapper:.5:determined:talk cam=push
inside-dark | Night came too fast. We turned off every light. And waited. | fx=dark cam=creep tag=NIGHT_2
inside-dark | At three in the morning, the front door opened. | sfx=creak cam=push fx=dark
inside-dark | And Ethan walked in. Alive. Smiling. | @ethan:.5:smile:walk+to=.5+y=100 fx=dark cam=zoom
inside-dark | ethan> [calm] Hey, guys. Lily wants to see you. All of you. | close=ethan @ethan:.5:smile:talk fx=dark
inside-dark | And when he smiled wider... his teeth were ^too long.^ | close=ethan @ethan:.5:creepy:idle fx=dark cam=zoom sfx=stinger

== 8
inside-dark | Ethan had been in the mine for a day. With his sister. | close=ethan @ethan:.5:creepy:idle t=black fx=dark cam=push
inside-dark | And whatever she'd fed him down there... it was ^working.^ | close=ethan @ethan:.5:creepy:idle fx=dark
inside-dark | trapper> [whispering] Nobody move. | close=trapper @trapper:.5:terrified:hush fx=dark
inside-dark | But Ethan wasn't a wendigo. Not yet. He could still see us. | close=me @me:.5:terrified:idle fx=dark cam=zoom
inside-dark | He walked straight up to Tom. And put a hand on his shoulder. | @ethan:.6:creepy:reach+y=80 @tom:.8:terrified:idle+y=80 fx=dark cam=push
inside-dark | ethan> [whispering] You held her down, Tom. Last year. I saw the video. | close=ethan @ethan:.5:angry:talk fx=dark
inside-dark | tom> [crying] I'm sorry. I'm so sorry. It was supposed to be funny. | close=tom @tom:.5:crying:talk fx=dark
inside-dark | Then the windows exploded. All of them. At once. | t=flash sfx=glass cam=shake fx=snow
inside-dark | Two of them. Climbing in from both sides. | !wendigo:.15:crawl+size=.85 fx=dark,snow cam=left sfx=stinger
inside-dark | Everybody froze. Except Ethan. | !wendigo:.85:idle+size=.85 @ethan:.45:creepy:idle+y=80 fx=dark cam=right
inside-dark | ethan> [laugh] They won't hurt me. ^I'm family now.^ | close=ethan @ethan:.5:creepy:talk fx=dark
inside-dark | And then the second wendigo moved. Faster than the first. | !wendigo:.5:reach+size=.9 fx=dark cam=shake
inside-dark | It grabbed Ethan. Not us. ^Ethan.^ | t=flash sfx=scream cam=shake fx=dark
inside-dark | And as it lifted him up... I saw what was hanging around its neck. | close=creature !wendigo:.5:idle fx=dark cam=zoom
inside-dark | A silver necklace. With an R. | close=me @me:.5:terrified:idle fx=dark sfx=stinger

== 9
inside-dark | Rose. She wasn't dead. She had never been dead. | close=me @me:.5:terrified:idle t=black fx=dark cam=push
inside-dark | Lily wrote that diary... to make the rescuers ^stop looking.^ | close=me @me:.5:shocked:idle fx=dark
inside-dark | Two sisters. Both changed. And Rose was protecting us from her own brother. | !wendigo:.5:idle+size=.9 fx=dark cam=zoom
inside-dark | The two monsters screamed at each other. The whole lodge shook. | !wendigo:.4:scream+size=.9 fx=dark,shake cam=shake sfx=stinger
inside-dark | trapper> [shouting] ^NOW!^ Everybody out! | close=trapper @trapper:.5:angry:talk fx=dark
lodge-dark | We ran. Tom. Me. Into the snow. | @me:.3:terrified:run+to=.1+y=150 @tom:.5:terrified:run+to=.25+y=150 cam=left
lodge-dark | Behind us, the stranger stood in the doorway. With a lantern. | @trapper:.5:determined:hold+lantern+y=100 cam=push
lodge-dark | He looked back at me. He looked almost happy. | close=trapper @trapper:.5:smile:idle
lodge-dark | trapper> [calm] Go home, kid. Tell people the truth about that prank. | close=trapper @trapper:.5:smile:talk
lodge-dark | Then he closed the door. And turned the gas all the way up. | sfx=door cam=zoom
lodge-dark | We were halfway to the cable car when the lodge ^exploded.^ | t=flash sfx=boom cam=shake fx=embers
lodge-dark | The fire burned for six hours. Nothing came out of it. | cam=pull fx=embers
cable | At dawn, the cable car came up the mountain. And two people were waiting for it. | cam=up tag=6:00_AM
cable | Me. And Tom. | @me:.4:sad:idle+y=150 @tom:.6:sad:idle+y=150 cam=push
cable | But in the snow by the station... there was a third set of footprints. Leading ^down^ the mountain. | cam=zoom sfx=stinger

== 10
station | The police didn't believe us. Of course they didn't. | @cop:.35:suspicious:sit+y=60 @me:.72:sad:sit+y=60 t=black cam=push tag=POLICE_STATION
station | cop> A gas explosion. Five dead. Including the man who caused it. That's the report. | close=cop @cop:.5:blank:talk
station | Five. Kyle. Megan. Ethan. The stranger. And... | close=me @me:.5:suspicious:idle
station | cop> And one female. Badly burned. ^Unidentified.^ | close=cop @cop:.5:blank:talk cam=zoom
station | One. Not two. One of the sisters got out. | close=me @me:.5:terrified:idle sfx=sub
station | They let us go home a week later. | cam=pull
bedroom | I couldn't sleep for months. Every time I closed my eyes, I saw the antlers. | @me:.35:sad:lie+y=-205+size=.85 cam=creep tag=THREE_MONTHS_LATER
bedroom | I told everyone the truth about the prank. Online. With my name on it. | @me:.5:sad:phone+item=phone+y=100 cam=push
bedroom | Lily's mum wrote to me. She said thank you. She said she forgives us. | prop=letter:Thank_you,_Nora./I_forgive_you./-_Mrs._Carter
bedroom | And then, one night in March, my phone buzzed. | sfx=buzz cam=zoom
bedroom | | prop=phone:notify:Rose_Carter:03:12/Thank_you_for_telling_them. hold=2.4
bedroom | Rose. The one who saved us. | close=me @me:.5:shocked:phone+item=phone cam=push
bedroom | A second message came in. | sfx=buzz
bedroom | | prop=phone:notify:Rose_Carter:03:13/I_can't_stay_here./I'm_getting_too_hungry. hold=2.4
bedroom | And then a third. | sfx=buzz cam=zoom
bedroom | | prop=phone:notify:Rose_Carter:03:13/Lock_your_window,_Nora. hold=2.4 sfx=stinger
bedroom | Lily knows ^where you live.^ | close=me @me:.5:terrified:phone+item=phone cam=zoom win=eyes
