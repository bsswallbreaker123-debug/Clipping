title: The Long Road
id: the-long-road
narrator: bm_george
music: emotional
accent: #e0b84a
tempo: 1.04

cast:
  me: Cal | adult | hair=short:#5a5a5a | beard=full | top=#4a5a6a:jacket | top2=#8a7a62 | pants=#3a3a3a | skin=#e8b48f | voice=am_fenrir
  wren: Wren | teen | hair=ponytail:#7a4a1e | top=#6a3a2a:jacket | top2=#d8c8a8 | pants=#3a4a5a | skin=#f6d7bf | voice=af_sky
  sara: Sara | kid | hair=long:#3a2414 | top=#e8c22a:shirt | skin=#f2c9a8 | voice=af_bella+3
  dana: Dana | adult | hair=ponytail:#8a5a3a | top=#5a6a4a:jacket | skin=#f2c9a8 | voice=af_nicole
  mara: Mara | adult | hair=buzz:#1a1a1a | top=#3a3a40:coat | skin=#6b4128 | voice=af_sarah
  rafe: Rafe | adult | hair=side:#5a3a22 | beard=stubble | top=#6a5a3a:jacket | voice=am_adam
  silas: Silas | adult | hair=side:#8a8a8a | beard=full | top=#2a2a30:coat | wrinkles | voice=bm_daniel
  eli: Eli | adult | hair=short:#1a1a1a | top=#7a3a2a:jacket | skin=#9a6440 | voice=am_echo
  hollow: The Hollowed | adult | hair=bald | top=#4a4a40:shirt | variant=infected | voice=am_fenrir+-6
  doc: Dr. Arden | adult | hair=bun:#c9a063 | top=#f1f1f1:coat | glasses | voice=bf_emma

scenes:
  home: room wall=#c9b79a:stripes floor=#6a4a2a:wood light=warm | sofa .3 c=#3a5a8a | tv .75 | window .55 y=-760
  street-old: outside sky=night far=city ground=asphalt weather=embers light=red | car .3 c=#5a5a5a | streetlamp .8 v=off | police .75
  zone: outside sky=day far=ruins ground=asphalt light=dusk | wall .5 y=-40 s=1.1 c=#7a7e86 | searchlight .9
  ruins: outside sky=dusk far=ruins ground=asphalt light=dusk | car .2 c=#5a4a3a | deadtree .85 s=.9 | streetlamp .55 v=off
  ruins-night: outside sky=night far=ruins ground=asphalt light=dark | car .2 c=#5a4a3a | deadtree .85 s=.9 | streetlamp .55 v=off
  building: room wall=#6a6a62:concrete floor=#3a3a36:plain light=dark | desk .3 y=60 | lamp .8 v=off | window .7 y=-760
  forest: outside sky=dusk far=pines ground=grass light=dusk | pine .1 s=1.2 c=#2a4a3a | pine .88 s=1.3 c=#2a4a3a
  camp: outside sky=night far=pines ground=grass | campfire .5 y=40 | pine .1 s=1.2 | pine .9 s=1.3
  dam: outside sky=day far=hills ground=grass light=day | wall .5 y=-80 s=1.2 c=#9aa0a8 | house .15 s=.45 y=-60 c=#b8a88a | house .85 s=.45 y=-60
  room: room wall=#8a7a62:wood floor=#5a4a3a:wood light=warm | bed .3 c=#6a5a4a | window .75 | lamp .9
  winter: outside sky=snow far=pines ground=snow weather=snow | pine .08 s=1.3 | deadtree .6 s=.9 | pine .92 s=1.3
  cabin: room wall=#4a3a2a:wood floor=#2a2016:wood light=warm | fireplace .78 | table .3 | candles .3 y=-275 s=.5 v=1
  hospital: room wall=#d8e4ea:tile floor=#8a98a4:tile light=cold | bed .35 c=#c8d8e8 | monitors .78 s=.6 y=-100 | lamp .1
  hall: room wall=#d8e4ea:tile floor=#8a98a4:tile light=red | door .5 s=1.1 | lamp .15
  sunset: outside sky=dawn far=hills ground=grass light=dusk | pine .1 s=.9 c=#3a5a3a | fence .5 y=60
  void: void

== 1
void | Twenty years after the world ended, a woman paid me to carry one girl across the country. | t=black cam=push
void | I didn't know she was the ^cure.^ | close=wren @wren:.5:neutral:idle cam=zoom
home | But first you need to know about my daughter. Sara. She was twelve. | @sara:.5:smile:sit+y=60 tag=20_YEARS_AGO cam=creep
home | She gave me a watch for my birthday. That night, the world ended. | @sara:.4:smile:hold+y=60 @me:.68:smile:idle+y=60 cam=push
street-old | People got sick. A fungus. In the brain. They stopped being people. | @hollow:.7:creepy:run+to=.5+y=100 cam=shake sfx=scream
street-old | We ran. Me and Sara. A soldier stopped us at the edge of town. | @me:.4:terrified:carry+y=120 cam=right sfx=siren
street-old | He had orders. Nobody leaves. | cam=zoom
street-old | I still hear the sound. Twenty years later. Every single night. | t=flash cam=shake sfx=sub
zone | The quarantine zone. Concrete walls. Ration cards. Soldiers. | tag=TODAY cam=up
zone | I'm a smuggler. I move things in and out. Pills. Guns. People. | @me:.5:blank:arms+y=150 cam=push
building | Then the rebels came to me. Their leader, Mara. | @mara:.35:determined:idle+y=60 @me:.7:suspicious:arms+y=60 cam=creep
building | mara> [calm] One package. Two hundred miles to the old capitol. The Lanterns are waiting. | close=mara @mara:.5:determined:talk
building | The package was a girl. Fourteen. Smart mouth. Knife in her boot. | @wren:.5:suspicious:arms+y=100 cam=push
building | wren> You're the guy? You look like a grumpy bear. | close=wren @wren:.5:smug:talk
building | I didn't want the job. I didn't want anybody that age near me. | close=me @me:.5:sad:idle
building | Then Wren rolled up her sleeve. | close=wren @wren:.5:neutral:idle cam=zoom
building | A bite. Three weeks old. | close=wren @wren:.5:sad:hold sfx=sub
building | Nobody lasts three days after a bite. She'd lasted ^three weeks.^ | close=wren @wren:.5:determined:idle cam=zoom sfx=stinger

== 2
building | Immune. The only one anyone had ever found. | close=wren @wren:.5:neutral:idle t=black cam=push
building | mara> The Lanterns have a lab. They can make a vaccine from her. Save everybody. | close=mara @mara:.5:determined:talk
building | My partner Dana came too. She'd watched my back for six years. | @dana:.5:smile:idle+y=100 cam=push
ruins | We left the zone through a sewer. Into the old city. | @me:.25:determined:walk+to=.45+y=120 @wren:.5:scared:walk+to=.65+y=120 @dana:.75:neutral:walk+to=.88+y=120 cam=right
ruins | Wren had never been outside the walls. She stopped at every billboard. | @wren:.5:smile:lookup+y=100 cam=up
ruins | wren> [happy] People used to just... buy shoes? Every week? | close=wren @wren:.5:grin:talk
ruins | Then we heard it. A clicking sound. Coming from a subway entrance. | sfx=tick cam=zoom
ruins-night | dana> [whispering] Hollowed. Don't move. They hunt by sound. | close=dana rule=RULE_#1 @dana:.5:scared:hush
ruins-night | It came up the stairs. Half of its face was ^mushroom.^ | @hollow:.6:creepy:walk+to=.45+y=120 cam=push sfx=whisper
ruins-night | It walked right between us. Clicking. Listening. | close=hollow @hollow:.5:creepy:idle cam=zoom
ruins-night | And then Wren's foot hit a can. | t=flash sfx=pop cam=shake
ruins-night | We ran. All of us. Through a building. Up three floors. | @wren:.4:terrified:run+to=.8+y=100 @dana:.2:terrified:run+to=.6+y=100 cam=right sfx=scream
building | We made it. We were safe. | @me:.5:relief:crouch+y=60 cam=creep
building | And then Dana sat down. And pulled up her sleeve. | close=dana @dana:.5:sad:idle
building | A bite. ^Fresh.^ | close=dana @dana:.5:crying:hold cam=zoom sfx=sub
building | dana> [crying] Get her there, Cal. Don't you dare let this be for nothing. | close=dana @dana:.5:crying:talk
building | And then she told us to go. And not to look back. | close=me @me:.5:crying:idle cam=push
building | I looked back. I always look back. | cam=zoom sfx=stinger

== 3
ruins | Two of us now. Two hundred miles. And she wouldn't stop talking. | @me:.3:sad:walk+to=.5+y=120 @wren:.6:smile:walk+to=.8+y=120 t=black cam=right
ruins | wren> [happy] Okay, joke. What did the ocean say to the beach? | close=wren @wren:.5:grin:talk
ruins | wren> [laugh] Nothing. It just ^waved.^ | close=wren @wren:.5:grin:talk
ruins | I didn't laugh. I wanted to. I hadn't laughed in twenty years. | close=me @me:.5:smile:idle cam=push
forest | Day eleven. A town called Ash Hollow. It looked empty. | tag=DAY_11 cam=up
forest | It wasn't. | cam=zoom sfx=sub
forest | Hunters. Men who'd stopped being people a long time ago. Without any fungus. | cam=shake sfx=crowd
forest | They chased us into a garage. And there, two other kids were hiding. | @eli:.7:scared:crouch+y=80 cam=push
forest | Eli. Nineteen. And his little brother Noah. Eight. | close=eli @eli:.5:scared:idle
forest | eli> [whispering] Get us out of this town and we'll owe you forever. | close=eli @eli:.5:determined:talk
camp | Four of us at a campfire. Wren and Noah drew pictures in the dirt. | @wren:.35:smile:sit+y=80 @eli:.7:smile:sit+y=80 cam=creep tag=NIGHT_11
camp | For one night, it felt like a family. | cam=push
camp | In the morning, Noah came out of his tent. Quiet. Too quiet. | cam=zoom
camp | He had his hand on his leg. On a bite he'd hidden ^all night.^ | cam=push sfx=sub
camp | Wren ran to him. She grabbed his hand. | close=wren @wren:.5:crying:idle
camp | wren> [crying] Cut my arm! Put my blood in his! It has to work! ^It has to!^ | close=wren @wren:.5:crying:talk cam=zoom sfx=stinger

== 4
camp | It didn't work. | close=wren @wren:.5:crying:idle t=black cam=push
camp | Wren sat in the dirt for three hours. Holding Noah's drawing. | @wren:.5:crying:sit+letter+y=80 cam=creep
camp | wren> [quiet] What's the point of being immune if I can't save anybody? | close=wren @wren:.5:crying:talk
camp | And I said the first honest thing I'd said in twenty years. | close=me @me:.5:sad:idle
camp | I said: "You got me out of bed every morning for three weeks. That's not nothing." | close=me @me:.5:sad:talk cam=push
camp | She didn't answer. But she held my hand that night. And I let her. | @wren:.4:sad:sit+y=80 @me:.62:sad:sit+y=80 cam=creep
dam | Day twenty-three. A dam with electricity. A town. My brother Rafe's town. | tag=DAY_23 cam=up
dam | rafe> [laugh] Cal? You ugly old bear! | @rafe:.3:grin:run+to=.45+y=120 @me:.65:smile:idle+y=120 cam=push
dam | Lights. Hot water. Kids playing football. Like the old world. | cam=right sfx=crowd
room | That night, I asked Rafe to take Wren the rest of the way. | @rafe:.35:neutral:sit+y=60 @me:.68:sad:sit+y=60 cam=creep
room | rafe> [quiet] You love that kid. I can see it. | close=rafe @rafe:.5:sad:talk
room | I said that's exactly why I can't take her. | close=me @me:.5:sad:talk
room | Everybody I love dies, Rafe. Sara. Dana. Everybody. | close=me @me:.5:crying:talk cam=push
room | And then the door creaked. Wren. She'd heard everything. | sfx=creak cam=zoom
room | wren> [crying] I'm not Sara. You don't get to ^swap me out.^ | close=wren @wren:.5:crying:talk cam=zoom sfx=stinger

== 5
dam | Wren stole a horse that night. And rode away from the dam. Alone. | t=black cam=push sfx=steps
forest | I found her at dawn. In an old ranch house. Waiting. Like she knew I'd come. | @wren:.5:sad:sit+y=100 cam=creep
forest | wren> [quiet] Everyone I've ever cared about either died or left me. | close=wren @wren:.5:crying:talk
forest | wren> Everyone except you. So don't tell me I'd be safer with somebody else. | close=wren @wren:.5:crying:talk cam=push
forest | I didn't have an answer. So I gave her the only thing I had. | close=me @me:.5:sad:idle
forest | Sara's watch. Cracked glass. Still ticking. | prop=clock:20:14:SARA'S_WATCH sfx=tick
forest | wren> [crying] You're... giving me this? | close=wren @wren:.5:crying:hold cam=zoom
forest | We went together. Just the two of us. | @me:.3:smile:walk+to=.55+y=120 @wren:.55:smile:walk+to=.8+y=120 cam=right
ruins | A university. The Lanterns' last address. | cam=up tag=DAY_40
ruins | Empty. Gone. Just a message painted on the wall: "Moved to St. Mary's Hospital." | prop=sign:MOVED_TO/ST._MARY'S:-_THE_LANTERNS
ruins | And then I heard a voice behind us. "Don't move." | cam=zoom sfx=steps
ruins | Hunters. Five of them. | cam=shake sfx=crowd
ruins | I pushed Wren behind a wall. And jumped down to the street. | t=flash cam=shake
ruins | I landed on a broken pipe. It went straight through my side. | close=me @me:.5:pain:idle sfx=stinger cam=zoom
ruins | The last thing I saw was Wren screaming my name. | close=wren @wren:.5:terrified:talk cam=zoom

== 6
winter | When I woke up, it was winter. | t=black tag=TWO_MONTHS_LATER cam=push
cabin | A cabin. A fire. And a fourteen-year-old girl who'd dragged me through the snow. For two months. | @wren:.5:determined:sit+y=80 cam=creep
cabin | She'd stitched me up with a sewing kit. She'd hunted. She'd kept me alive. | close=wren @wren:.5:determined:idle
cabin | But we were out of medicine. And I had a fever. | close=me @me:.5:pain:idle cam=push
winter | So she went out alone. To trade a deer for antibiotics. | @wren:.5:determined:walk+to=.8+y=150 cam=right
winter | And she met a man in the snow. With a kind voice. And a whole town behind him. | @silas:.4:smile:idle+y=150 @wren:.7:suspicious:idle+y=150 cam=push
winter | silas> [calm] A girl alone in winter. You must be very brave. Or very hungry. | close=silas @silas:.5:smile:talk
winter | He gave her the medicine. For free. | close=wren @wren:.5:suspicious:idle
winter | silas> [calm] Come visit us. We always have ^plenty of meat.^ | close=silas @silas:.5:creepy:talk cam=zoom sfx=sub
cabin | She brought the medicine back. I lived. | @wren:.5:relief:sit+y=80 cam=creep
cabin | But two days later, I woke up and the cabin was empty. | cam=push
cabin | Footprints in the snow. Hers. And around them... ^twelve^ pairs of boots. | cam=zoom sfx=stinger
winter | They'd taken her. | cam=push sfx=gust

== 7
winter | I couldn't walk. So I crawled. | @me:.4:pain:crouch+y=150 t=black cam=right sfx=gust
winter | Then I found a horse. Then I found the town. | cam=up
winter | A church. Smoke from the chimney. And a smell I'll never forget. | cam=push fx=snow
cabin | Inside, Silas had Wren tied to a chair. | @silas:.4:smile:idle+y=80 @wren:.7:angry:sit+y=80 cam=creep
cabin | silas> [calm] You're special, aren't you? Bitten and still here. | close=silas @silas:.5:smile:talk
cabin | silas> Imagine. A girl who could live forever. I'd keep you ^very safe.^ | close=silas @silas:.5:creepy:talk cam=zoom
cabin | wren> [angry] I'm going to bite you. And I'm going to ^enjoy it.^ | close=wren @wren:.5:angry:talk
cabin | Then the window broke. And I came through it. | t=flash sfx=glass cam=shake
cabin | Silas ran into the burning hallway. The building was on fire. | fx=embers cam=shake sfx=slam
cabin | I cut Wren's ropes. She was shaking so hard she couldn't stand. | @me:.4:pain:carry+y=80 fx=embers cam=push
winter | I carried her out through the snow. | @me:.5:pain:carry+y=150 cam=right fx=snow
winter | wren> [crying] It's okay. Cal. It's okay. Baby girl. That's what you kept saying. | close=wren @wren:.5:crying:talk
winter | I hadn't called anyone that in twenty years. | close=me @me:.5:crying:idle cam=zoom
winter | Behind us, the church burned all night. | fx=embers cam=pull sfx=stinger

== 8
sunset | Spring. The last week of the trip. Everything was green again. | tag=SPRING t=black cam=push
sunset | Wren was quieter. She'd seen too much. She didn't make jokes anymore. | @wren:.4:sad:walk+to=.6+y=150 @me:.7:worried:walk+to=.85+y=150 cam=right
ruins | Then we climbed an old building in the city. To see the road ahead. | cam=up @me:.4:determined:walk+to=.55+y=60 @wren:.2:smile:walk+to=.35+y=80
ruins | And at the top, she stopped. | cam=push
sunset | Deer. Hundreds of them. Walking through an empty highway. In the gold light. | cam=right fx=dust
sunset | Wren laughed. Really laughed. For the first time in months. | close=wren @wren:.5:smile:idle
sunset | wren> [happy] Look at them, Cal. The world's still ^going.^ | close=wren @wren:.5:grin:talk cam=push
sunset | I'll remember her face in that moment for the rest of my life. | close=wren @wren:.5:smile:idle cam=zoom
hospital | Two days later, we found St. Mary's. The Lanterns were real. | @mara:.5:smile:wave+y=100 cam=push tag=ST._MARY'S
hospital | Mara was there. Alive. She hugged Wren like her own kid. | @mara:.4:crying:hug+y=100 @wren:.6:smile:hug+y=100 cam=creep
hospital | The doctors took Wren for tests. And I took a shower. My first in a year. | cam=push
hall | When I came out, a doctor was waiting for me. Dr. Arden. | @doc:.5:sad:idle+y=80 cam=creep
hall | doc> [quiet] The fungus grows in her brain. To make a vaccine, we have to ^remove it.^ | close=doc @doc:.5:sad:talk
hall | I asked what that meant for Wren. | close=me @me:.5:terrified:idle
hall | doc> [quiet] She won't wake up. The surgery is in one hour. | close=doc @doc:.5:sad:talk cam=zoom sfx=stinger

== 9
hall | They didn't ask her. They were going to cut her open while she slept. | close=me @me:.5:angry:idle t=black fx=red cam=push
hall | I told Mara: find another way. | close=me @me:.5:angry:talk fx=red
hall | mara> [crying] There IS no other way, Cal. Millions of lives. Against one. | close=mara @mara:.5:crying:talk fx=red
hall | One. She said "one", like it was a number. | close=me @me:.5:angry:idle fx=red cam=zoom
hall | It wasn't a number. It was the girl who taught me how to ^laugh^ again. | close=me @me:.5:crying:idle fx=red
hall | I don't want to tell you what I did next. I'm not proud of it. | t=flash sfx=alarm cam=shake fx=red
hospital | I walked into that operating room. And I carried her out. | @me:.5:determined:carry+y=80 fx=red cam=push
hospital | Doctors. Soldiers. Mara standing in the doorway. Begging. | @mara:.5:crying:hands-up+y=80 fx=red cam=zoom
hospital | I walked past all of them. | fx=red cam=right sfx=steps
forest | When Wren woke up in the back of a truck, she asked what happened. | @wren:.5:sleep:lie+y=-60+size=.85 cam=creep tag=TWO_DAYS_LATER
forest | So I lied. | close=me @me:.5:sad:idle
forest | I said there were dozens of immune kids. The Lanterns stopped looking. The cure didn't work. | close=me @me:.5:sad:talk cam=push
forest | She looked at me for a long time. | close=wren @wren:.5:suspicious:idle cam=zoom
forest | wren> [quiet] Swear to me. Swear that what you just said is ^true.^ | close=wren @wren:.5:sad:talk cam=zoom sfx=stinger

== 10
forest | "Swear to me." | close=wren @wren:.5:sad:idle t=black cam=push
forest | And I looked her right in the eyes. And I said: ^"I swear."^ | close=me @me:.5:sad:idle cam=zoom
forest | She nodded. "Okay." That's all she said. | close=wren @wren:.5:blank:idle
dam | We went back to Rafe's town. She went to school. She had friends. She played football. | @wren:.5:smile:run+to=.7+y=150 cam=right tag=ONE_YEAR_LATER
dam | Every night she wound up Sara's watch. | prop=clock:20:14:SARA'S_WATCH sfx=tick
room | And one night, a year later, she sat on the end of my bed. | @wren:.5:sad:sit+y=60 cam=creep
room | wren> [quiet] I went back to St. Mary's, Cal. I read the files. | close=wren @wren:.5:sad:talk
room | wren> I know what you did. I know you lied. | close=wren @wren:.5:crying:talk cam=push
room | I waited for her to scream at me. To leave. Like everybody leaves. | close=me @me:.5:crying:idle
room | wren> [crying] My whole life could have meant something. And you took it. | close=wren @wren:.5:crying:talk cam=zoom
room | wren> [quiet] I don't know if I can ever forgive you. But I'd like to try. | close=wren @wren:.5:sad:talk
room | That was enough. More than I deserved. | close=me @me:.5:crying:idle cam=creep
room | She left a letter on my pillow that night. | cam=push
room | | prop=note:I'm_going_back./They_still_need_the_cure./I_love_you,_old_bear. hold=2.8 sfx=page
sunset | By the time I woke up... she'd already been gone for ^six hours.^ | cam=pull sfx=stinger
sunset | And the road to St. Mary's is two hundred miles long. I know. I've walked it. | close=me @me:.5:determined:idle cam=zoom
