title: Inside
id: inside
narrator: bm_george
music: tension
accent: #ffb020
tempo: 1.07

cast:
  me: Adam | adult | hair=buzz:#2a2a2a | top=#d9822a:jumpsuit | badge=941 | skin=#f2c9a8 | voice=am_michael
  meS: Adam | adult | hair=side:#2a2a2a | top=#22252c:suit | top2=#f1f1f1 | skin=#f2c9a8 | voice=am_michael
  cole: Cole | adult | hair=buzz:#5a3a22 | top=#d9822a:jumpsuit | badge=117 | beard=stubble | build=1.2 | skin=#f2c9a8 | voice=am_adam
  diego: Diego | teen | hair=short:#1a1a1a | top=#d9822a:jumpsuit | badge=588 | skin=#c98e64 | voice=am_puck
  varga: Varga | old | hair=side:#d8d4cc | top=#d9822a:jumpsuit | badge=003 | glasses | wrinkles | voice=bm_daniel
  skinner: Skinner | adult | hair=long:#8a7a5a | top=#d9822a:jumpsuit | badge=666 | beard=moustache | skin=#f6d7bf | voice=am_fenrir
  bellamy: Captain Bellamy | adult | hair=cap:#2a3a5a | top=#2a3a5a:uniform | build=1.25 | beard=moustache | voice=am_onyx
  guard: Guard | adult | hair=cap:#2a3a5a | top=#2a3a5a:uniform | voice=am_eric
  hart: Dr. Hart | adult | hair=ponytail:#7a3a1e | top=#f1f1f1:coat | top2=#8ab0d0 | voice=af_bella
  lowe: Warden Lowe | old | hair=bald | top=#3a3a40:suit | top2=#f1f1f1 | glasses | voice=bm_george
  man: The Man in Grey | adult | hair=side:#888 | top=#5a5e66:suit | top2=#f1f1f1 | voice=bm_lewis

scenes:
  bank: room wall=#d8d0bc:stone floor=#8a7a62:check light=warm | lamp .1 | lamp .9 | desk .5 y=40
  parlor: room wall=#2a2228:brick floor=#1e1a1e:wood light=warm | lamp .2 | chair .55 | picture .8 c=#a03030
  prison: outside sky=storm far=hills ground=asphalt light=cold | wall .5 y=-60 s=1.2 | searchlight .12 | searchlight .9
  gate: outside sky=night far=hills ground=asphalt | wall .5 y=-60 s=1.4 c=#7a7e86 | streetlamp .2 | streetlamp .8
  cell: room wall=#8a8e96:concrete floor=#4a4e56:plain light=cold | bunk .3 c=#6a7080 | sink .8 | bars .5 fg
  cell-in: room wall=#8a8e96:concrete floor=#4a4e56:plain light=cold | bunk .25 c=#6a7080 | sink .78
  cell-dark: room wall=#8a8e96:concrete floor=#4a4e56:plain light=dark | bunk .25 c=#6a7080 | sink .78
  block: room wall=#7a7e86:concrete floor=#3a3e46:plain light=cold | bars .5 | lamp .15 | lamp .85
  yard: outside sky=storm far=hills ground=asphalt light=cold | fence .5 y=-40 c=#b8bcc4 | searchlight .9 | crowd .5 v=12 y=120 c=#a85a1e
  infirmary: room wall=#e6ecee:tile floor=#a8b4b8:tile light=cold | bed .3 c=#c8d8e8 | desk .75 | window .75 v=day
  shop: room wall=#5a5a50:brick floor=#3a3a36:concrete light=warm | table .3 | table .75 | lamp .5
  office: room wall=#5a4a3a:wood floor=#3a2a1a:wood light=warm | desk .5 y=40 | books .12 | window .82
  chamber: room wall=#3a3a40:concrete floor=#22232a:plain light=dark | chair .5 s=1.4 | lamp .5 | monitors .5 y=-200 s=.5
  pipes: room wall=#3a3436:stone floor=#2a2628:plain light=dark | lamp .3 | lamp .8
  wall-night: outside sky=storm far=hills ground=asphalt weather=rain light=dark | wall .5 y=60 s=1.6 | searchlight .85
  road: outside sky=dawn far=pines ground=road light=dusk | van .5 c=#e8e8e8 | pine .08 s=1.1 | pine .92 s=1.2
  void: void

== 1
void | To get my brother out of prison... I had to get *in* first. | t=black cam=push
block | My big brother Cole is on death row. For killing a police chief. | @cole:.5:sad:sit+y=60 fx=dark cam=creep
block | He didn't do it. I know because I was with him. Nobody believed me. | close=cole @cole:.5:sad:idle
block | They set his execution for ^thirty days^ from now. | prop=calendar:30:EXECUTION:BLACKWATER_PENITENTIARY sfx=sub
parlor | So I did something crazy. | @meS:.55:determined:sit+y=60 cam=push
parlor | I'm a structural engineer. I designed the renovation of Blackwater Penitentiary. | close=meS @meS:.5:neutral:idle
parlor | And I had the ^entire blueprint^ tattooed on my body. | close=meS @meS:.5:determined:idle cam=zoom
void | | prop=map:CELL_BLOCK_B:THE_YARD hold=2.6
parlor | Every pipe. Every vent. Every guard tower. Hidden inside a dragon. | cam=push
bank | Then I walked into a bank with a toy gun... and waited for the police. | @meS:.5:smug:point+y=120 cam=right sfx=alarm
bank | I didn't even run. I sat down on the floor and smiled. | @meS:.5:smile:sit+y=150 cam=creep sfx=siren
prison | Five years. Blackwater Penitentiary. Exactly what I asked for. | cam=up
gate | The gates shut behind me with a sound I'll never forget. | t=flash sfx=slam cam=push
block | Prisoner 941. They put me in Block B. | @me:.5:neutral:walk+to=.5+y=120 @guard:.2:blank:walk+to=.3+y=120 cam=right
block | Three cells away from death row. | cam=push
yard | On my first day in the yard, I found him. | @me:.3:neutral:walk+to=.42+y=150 @cole:.75:shocked:idle+y=150 cam=right
yard | cole> [angry] Adam? What are you doing here?! | close=cole @cole:.5:shocked:talk
yard | I didn't say anything. I just opened my shirt. And let him see the ^map.^ | close=me @me:.5:determined:idle cam=zoom
yard | cole> [whispering] You're insane. | close=cole @cole:.5:shocked:talk
yard | cole> [whispering] And you're too late. They moved my execution. It's not in thirty days. | close=cole @cole:.5:terrified:talk cam=push
yard | cole> [whispering] It's in ^eight.^ | close=cole @cole:.5:terrified:talk cam=zoom sfx=stinger

== 2
yard | Eight days. My whole plan needed thirty. | close=me @me:.5:terrified:idle t=black cam=push
cell-in | My cellmate was a kid. Diego. Nineteen. In for stealing a car he didn't know was stolen. | @diego:.3:smile:sit+y=40 @me:.7:neutral:idle+y=60 cam=creep
cell-in | diego> Bro, you've got a whole city on your back. What is that? | close=diego @diego:.5:smile:talk
cell-in | I told him it was art. He didn't believe me. Nobody ever did. | close=me @me:.5:smile:idle
shop | The plan started in the workshop. Prison Industries. Run by one man. | cam=push
shop | Varga. Seventy years old. Ran half the city from his cell. | @varga:.5:smug:sit+y=60 cam=zoom
shop | varga> [calm] Everybody who works in my shop pays me. What are you paying with, engineer? | close=varga @varga:.5:smug:talk
shop | I told him the truth. A way ^out.^ | close=me @me:.5:determined:idle cam=push
shop | varga> [chuckle] Then you're hired. | close=varga @varga:.5:grin:talk
yard | Then the man who runs the guards noticed me. Captain Bellamy. | @bellamy:.5:angry:arms+y=120+size=1.15 cam=push sfx=steps
yard | bellamy> New fish. Pretty tattoos. Let's see if they ^bleed.^ | close=bellamy @bellamy:.5:smug:talk
cell-dark | That night, I studied my left arm in the dark. Section four. Behind our toilet. | fx=dark cam=creep tag=DAY_2
cell-dark | A pipe. Old. Rusty. Leading to the generator room. | close=me @me:.5:determined:idle fx=dark
cell-dark | I needed six bolts out. I'd made a screwdriver from a bed frame. | @me:.75:determined:crouch+y=60 fx=dark cam=push sfx=tick
cell-dark | The first bolt turned. The second. The third. | sfx=click cam=zoom fx=dark
cell-dark | Then I shone a match through the hole. | t=flash fx=dark sfx=sub
cell-dark | The pipe was gone. Replaced last year with ^solid concrete.^ | close=me @me:.5:terrified:idle fx=dark cam=shake
cell-dark | And then a voice from the top bunk. | cam=push fx=dark
cell-dark | diego> [whispering] Bro... you're escaping, aren't you? | close=diego @diego:.5:shocked:talk fx=dark cam=zoom sfx=stinger

== 3
cell-dark | Diego knew. One word to a guard and I'd be in solitary until Cole was dead. | close=diego @diego:.5:suspicious:idle t=black fx=dark cam=push
cell-dark | diego> [whispering] Take me with you. And I swear I won't say anything. | close=diego @diego:.5:determined:talk fx=dark
cell-dark | So I had a new partner. And still no way through the concrete. | close=me @me:.5:sad:idle fx=dark
infirmary | I needed another route. Section seven. The infirmary. | cam=push tag=DAY_3
infirmary | I faked diabetes. Shots every day. The doctor's name was Dr. Hart. | @hart:.3:smile:hold+y=60 @me:.7:neutral:sit+y=60 cam=creep
infirmary | hart> [calm] You don't have diabetes, 941. Your blood sugar is perfect. | close=hart @hart:.5:suspicious:talk
infirmary | hart> But you come here every day. And you look at that window like it ^owes you money.^ | close=hart @hart:.5:smile:talk cam=push
infirmary | That window opened onto the roof. And from the roof... the wall. | cam=right
infirmary | I asked her to leave the infirmary door unlocked. Just once. One night. | close=me @me:.5:sad:idle
infirmary | hart> [quiet] Why would I ever do that? | close=hart @hart:.5:sad:talk
infirmary | So I told her about Cole. About the chief. About the night I was with him. | close=me @me:.5:sad:idle cam=creep
infirmary | She didn't say yes. But she didn't say no. | close=hart @hart:.5:worried:idle cam=zoom
shop | Back in the shop, Varga had news. | @varga:.5:smug:sit+y=60 cam=push
shop | varga> [calm] Skinner is talking. About an engineer with a map on his back. | close=varga @varga:.5:suspicious:talk
yard | Skinner. Number 666. The most dangerous man in Blackwater. | @skinner:.5:creepy:idle+y=150+size=1.1 cam=push sfx=sub
yard | He walked up to me in the yard. Close enough to smell. | @skinner:.42:creepy:walk+to=.5+y=150 @me:.75:scared:idle+y=150 cam=zoom
yard | skinner> [whispering] Pretty dragon. I want a ride on it. Or I ^tell Bellamy.^ | close=skinner @skinner:.5:creepy:talk cam=push sfx=stinger

== 4
yard | Now my escape had five people. Me. Cole. Diego. Varga. And a monster. | cam=push t=black
block | Day five. Three days left. And I still had no way out of Block B. | tag=DAY_5 cam=creep
block | Then I looked at my right shoulder in the mirror. Section nine. A word I'd never noticed. | close=me @me:.5:suspicious:think
void | | prop=sign:STORM/DRAIN:DESIGNED_1902 hold=2.2
block | Under the old wing was a storm drain from 1902. It ran under the wall. | cam=push
block | I'd only needed to get ^underneath^ Block B. Not through it. | close=me @me:.5:determined:idle cam=zoom
block | And the only way down... was the guard's break room floor. | cam=right
yard | So we needed a riot. Twenty minutes of chaos. | rule=THE_PLAN cam=push
yard | Varga's people started a fight. Then everybody did. | fx=shake cam=shake sfx=crowd
yard | Fire alarms. Guards running. Smoke. | fx=shake,embers sfx=alarm cam=shake
pipes | We broke the floor in eleven minutes. We were in. | @me:.4:determined:crouch+y=60 @diego:.65:scared:crouch+y=60 fx=dark cam=push
pipes | The drain was there. Exactly where my tattoo said. | cam=right fx=dark sfx=gust
pipes | And then Diego grabbed my arm. | close=diego @diego:.5:terrified:idle fx=dark
pipes | diego> [whispering] Adam. The guard from the break room. He saw us. | close=diego @diego:.5:terrified:talk fx=dark
infirmary | They took me to the infirmary with a bleeding head. And Dr. Hart cleaned it. | @hart:.4:worried:hold+y=60 @me:.68:pain:sit+y=60 cam=creep
infirmary | Then she pulled back my sleeve to put in the needle. | close=hart @hart:.5:suspicious:idle
infirmary | She stared at my arm for a long time. | close=hart @hart:.5:shocked:idle cam=push
infirmary | hart> [whispering] That's the building. That's... ^this room.^ | close=hart @hart:.5:terrified:talk cam=zoom sfx=stinger

== 5
infirmary | She knew. My whole plan was in her hands now. | close=hart @hart:.5:terrified:idle t=black cam=push
infirmary | hart> [whispering] Give me one reason not to call the warden. | close=hart @hart:.5:angry:talk
infirmary | I gave her one. A newspaper from the day the chief died. Cole's face was on page one. | prop=news:POLICE_CHIEF_KILLED:CITY_HERALD:Suspect:_Cole_Vance hold=2.2
infirmary | And on page four, a small photo. A man in a grey suit leaving the building. | prop=photo:THE_MAN_IN_GREY sfx=sub
infirmary | hart> I know that man. He visits the warden. Every ^Thursday.^ | close=hart @hart:.5:shocked:talk cam=zoom
office | That Thursday, Dr. Hart walked past the warden's office with a cup of coffee. | @hart:.2:neutral:walk+to=.35+item=cup+y=80 cam=push tag=DAY_6
office | The door was open an inch. | cam=creep
office | man> [calm] Vance dies on Friday. If his brother causes trouble... ^he dies too.^ | @man:.4:blank:idle+y=60 @lowe:.7:scared:sit+y=60 cam=zoom
office | Warden Lowe looked sick. He signed the paper anyway. | close=lowe @lowe:.5:sad:write
infirmary | She told me everything. Her hands were shaking. | @hart:.4:scared:talk+y=60 @me:.68:shocked:sit+y=60 cam=push
infirmary | hart> [whispering] Friday. Midnight. I'll leave the door open. | close=hart @hart:.5:determined:talk
infirmary | That was the first time anyone on the outside believed us. | close=me @me:.5:relief:idle cam=creep
block | Then the speakers crackled across Block B. | sfx=buzz cam=up
block | lowe> Attention. By order of the Governor, the execution of Cole Vance has been moved. | cam=push
block | lowe> It will take place ^tonight.^ | cam=zoom sfx=stinger
block | Cole looked across the block at me. Through two sets of bars. | close=cole @cole:.5:sad:idle
block | He mouthed one word. ^Go.^ | close=cole @cole:.5:sad:idle cam=zoom

== 6
chamber | Midnight. The execution room. Two hundred people watching through glass. | @cole:.5:sad:sit+y=-40+size=1.1 fx=dark t=black cam=push
chamber | They strapped my brother into the chair. | close=cole @cole:.5:sad:idle fx=dark
chamber | lowe> Do you have any last words, Cole Vance? | close=lowe @lowe:.5:sad:talk fx=dark
chamber | cole> [calm] Yeah. Tell my little brother... I'm proud of him. | close=cole @cole:.5:crying:talk fx=dark cam=push
pipes | And I was underneath them. In the generator room. With a wrench. | @me:.5:determined:crouch+y=60 fx=dark cam=zoom
pipes | Section six. The main cable. My left shoulder. | close=me @me:.5:determined:idle fx=dark
chamber | lowe> [sigh] Proceed. | close=lowe @lowe:.5:blank:talk fx=dark
chamber | The man pulled the lever. | t=flash sfx=buzz cam=shake fx=flicker
chamber | And every light in Blackwater ^went out.^ | fx=blackout sfx=sub cam=shake
chamber | Forty-eight seconds. That's how long the backup generator takes. | prop=clock:00:48:BACKUP_GENERATOR sfx=tick
chamber | Forty-eight seconds of darkness. Two hundred people screaming. | fx=blackout cam=shake sfx=crowd
chamber | When the lights came back... the chair was ^empty.^ | fx=flicker cam=zoom sfx=stinger
pipes | Varga had a guard on his payroll. That guard had a key. | @cole:.4:shocked:run+to=.6+y=60 @varga:.72:smug:idle+y=60 fx=dark cam=right
pipes | Cole fell through the door of the generator room straight into my arms. | @cole:.45:crying:hug+y=60 @me:.6:crying:hug+y=60 fx=dark cam=push
pipes | cole> [crying] You crazy... beautiful... idiot. | close=cole @cole:.5:crying:talk fx=dark
pipes | Then a flashlight hit us both. | t=flash fx=dark cam=shake
pipes | Captain Bellamy. With six guards. | @bellamy:.5:angry:point+torch+y=120+size=1.1 fx=dark cam=zoom
pipes | bellamy> [cold] Funny thing about blackouts, engineer. ^I've been waiting for one.^ | close=bellamy @bellamy:.5:smug:talk fx=dark cam=push sfx=stinger

== 7
pipes | Bellamy knew. He'd known for days. | close=bellamy @bellamy:.5:smug:idle t=black fx=dark cam=push
pipes | bellamy> [calm] Somebody told me. Somebody in your little crew. | close=bellamy @bellamy:.5:grin:talk fx=dark
pipes | And from behind the guards stepped... Varga. | @varga:.5:smug:walk+to=.5+y=120 fx=dark cam=zoom sfx=steps
pipes | varga> [calm] Nothing personal, engineer. A man my age doesn't escape. He ^negotiates.^ | close=varga @varga:.5:smug:talk fx=dark
pipes | Varga traded us for a pardon. Seventy years old. And free by Christmas. | close=me @me:.5:angry:idle fx=dark cam=push
cell-dark | They threw me into solitary. Cole into a cell in the old wing. Diego got beaten. | fx=dark cam=creep sfx=slam
cell-dark | Three days in the dark. No food. Just my tattoos and my thoughts. | close=me @me:.5:sad:idle fx=dark
cell-dark | And then, on the third night, the slot in my door opened. | sfx=click fx=dark cam=push
cell-dark | A hand pushed something through. | fx=dark cam=zoom
cell-dark | A key. Wrapped in a napkin. Written on it in pen: | prop=note:Section_9./Thursday._2_AM./-_H. hold=2.4 sfx=page
cell-dark | Dr. Hart. | close=me @me:.5:relief:idle fx=dark
cell-dark | But under the note there was a second line. In different handwriting. | cam=push fx=dark
cell-dark | | prop=note:Don't_forget_me./-_666 hold=2.2 sfx=stinger
cell-dark | Skinner. He'd seen her. And he was coming ^with us.^ | close=me @me:.5:terrified:idle fx=dark cam=zoom

== 8
pipes | Thursday. Two in the morning. Section nine. The storm drain from 1902. | tag=DAY_10_-_2:00_AM t=black fx=dark cam=push
pipes | I got Cole out of the old wing with Hart's key. | @cole:.35:determined:walk+to=.5+y=80 @me:.6:determined:walk+to=.75+y=80 fx=dark cam=right
pipes | I got Diego from the infirmary. His face still bruised. | @diego:.5:pain:walk+to=.62+y=100 fx=dark
pipes | And waiting at the drain, smiling with all his yellow teeth... | fx=dark cam=push
pipes | ...Skinner. | close=skinner @skinner:.5:creepy:idle fx=dark cam=zoom sfx=sub
pipes | skinner> [whispering] Ladies first. | close=skinner @skinner:.5:creepy:talk fx=dark
pipes | We crawled through a pipe built a hundred and twenty years ago. In freezing water. | @me:.4:pain:crouch+y=80 @cole:.7:pain:crouch+y=80 fx=dark,rain cam=right sfx=gust
wall-night | It came out on the other side of the wall. In a ditch. In the rain. | cam=up
wall-night | Free. Actually ^free.^ | @me:.4:relief:idle+y=120 @cole:.6:relief:idle+y=120 cam=push
wall-night | Then the searchlight swung around. And stopped right on us. | t=flash cam=shake sfx=alarm
wall-night | Sirens. Dogs. A whole prison waking up. | sfx=siren cam=shake fx=shake
wall-night | Skinner looked at Diego. Slowest of us. Bruised. | close=skinner @skinner:.5:creepy:idle cam=push
wall-night | And he shoved him back towards the light. | t=flash cam=shake sfx=slam
wall-night | skinner> [laugh] Run, boys! The dogs need something to ^eat!^ | close=skinner @skinner:.5:creepy:talk cam=zoom sfx=stinger

== 9
wall-night | Diego in the searchlight. The dogs twenty seconds away. | @diego:.5:terrified:hands-up+y=120 t=black cam=push
wall-night | And I ran back for him. | @me:.3:determined:run+to=.45+y=120 cam=right
wall-night | Cole screamed my name. Then he ran back too. | @cole:.2:angry:run+to=.35+y=120 cam=right
wall-night | Cole picked Diego up like a sack of flour. And we ran into the trees. | @cole:.5:determined:carry+y=120 cam=right sfx=steps
road | At dawn, we came out of the forest on a road. A white van was waiting. | cam=up tag=6:12_AM
road | Dr. Hart. Behind the wheel. No uniform. No badge. | @hart:.5:smile:wave+y=150 cam=push
road | hart> [laugh] Took you long enough. | close=hart @hart:.5:smile:talk
road | But she wasn't alone in the van. | cam=zoom
road | A man in a grey suit was sitting in the back seat. | @man:.5:blank:sit+y=120 cam=push sfx=sub
road | The man from the photo. The man who visited the warden. | close=man @man:.5:blank:idle
road | Cole stepped in front of me. Fists up. | @cole:.5:angry:fists+y=150+size=1.15 cam=push
road | man> [calm] Relax, Cole. I'm not here to hurt you. | close=man @man:.5:smile:talk
road | man> I'm here because you're my sons. And I'm the reason ^you were framed.^ | close=man @man:.5:sad:talk cam=zoom sfx=stinger

== 10
road | Our father. Who left when I was four. In a grey suit. | close=man @man:.5:sad:idle t=black cam=push
road | man> [calm] The chief found out what my employers were doing. They needed someone to blame. | close=man @man:.5:sad:talk
road | man> I was told it would be a stranger. When I found out it was Cole... it was ^too late.^ | close=man @man:.5:sad:talk cam=zoom
road | Cole didn't hit him. I thought he would. | close=cole @cole:.5:angry:idle
road | man> [calm] I've brought you something. Everything they did. Twenty years of it. | prop=photo:EVIDENCE_-_THE_BOARD sfx=page
road | man> Give it to a journalist. Not the police. ^Never^ the police. | close=man @man:.5:determined:talk
road | Then he got out of the van. And walked back towards the prison. | @man:.5:sad:walk+to=.2+y=120 cam=left
road | He turned himself in. Confessed to everything. | cam=pull
void | | prop=news:COLE_VANCE_INNOCENT:CITY_HERALD:Father_confesses_to_cover-up hold=2.4 sfx=stinger
yard | Warden Lowe resigned. Bellamy got arrested. Varga's pardon was cancelled. | cam=push
road | Cole was pardoned in March. Diego's sentence was cut to time served. | @cole:.3:smile:idle+y=150 @diego:.7:smile:wave+y=150 cam=right tag=SIX_MONTHS_LATER
road | And me? I still had five years for robbing a bank with a toy gun. | close=me @me:.5:smile:idle
road | Dr. Hart visits every Sunday. She says she's waiting. | @hart:.5:smile:idle+y=150 cam=push
cell-in | Last night, a new prisoner was put in my cell. | @me:.3:neutral:sit+y=40 cam=creep
cell-in | He had a tattoo on his arm. Fresh. Still red. | close=me @me:.5:shocked:idle
void | | prop=map:SONA_PRISON:EXIT hold=2.4
cell-in | A map. Of a prison I'd never heard of. And under it, my name. | close=me @me:.5:terrified:idle cam=zoom sfx=stinger
