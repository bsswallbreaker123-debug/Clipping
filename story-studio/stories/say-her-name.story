title: Say Her Name
id: say-her-name
narrator: bm_george
music: eerie
accent: #ff3b6b
tempo: 1.06

cast:
  me: Caleb | teen | hair=messy:#5a3a22 | top=#5a7aa8:hoodie | skin=#f6d7bf | voice=am_puck
  maya: Maya | teen | hair=curly:#1a1a1a | top=#e8c22a:sweater | top2=#fff3c8 | skin=#9a6440 | voice=af_nicole
  hana: Hana | teen | hair=bob:#1a1a1a | top=#7aa86a:shirt | glasses | skin=#f2c9a8 | voice=af_sky
  bree: Bree | teen | hair=ponytail:#e0c070 | top=#e86a9a:hoodie | skin=#f6d7bf | voice=af_sarah
  gran: Grandma Ruth | old | hair=bun:#e8e4dc | top=#6a3a5a:sweater | top2=#e9dcc0 | glasses | wrinkles | voice=bf_emma
  mary: Mary | teen | hair=long:#0b0b0d | top=#e6eaec:dress | variant=ghost | voice=bf_lily+-2
  meX: Caleb | teen | hair=messy:#5a3a22 | top=#5a7aa8:hoodie | skin=#f6d7bf | variant=wrong | voice=am_puck+-3

scenes:
  bedroom: room wall=#8a6a9a:stripes floor=#6a4a3a:wood light=warm | bed .3 c=#e86a9a | lamp .88 | window .7 v=curtain:#5a3a6a | picture .5 y=-80
  bedroom-dark: room wall=#8a6a9a:stripes floor=#6a4a3a:wood light=dark | bed .3 c=#e86a9a | window .7 v=curtain:#5a3a6a:closed
  bathroom: room wall=#d8dce0:tile floor=#8a929c:check light=dark | mirror .5 s=1.2 | sink .5 | candles .5 y=-330 s=.45 v=1
  bathroom-ghost: room wall=#d8dce0:tile floor=#8a929c:check light=dark | mirror .5 s=1.2 | sink .5 | candles .5 y=-330 s=.45 v=1
  hallway: room wall=#8a7a6a:stripes floor=#5a4a3a:wood light=dark | mirror .2 s=.8 | door .62 s=1.1 | picture .85
  school: room wall=#c8d0d8:tile floor=#8a929c:check light=cold | lockers .5
  library: room wall=#5a4632:wood floor=#3a2a1a:wood light=warm | books .14 | books .86 | table .5 | lamp .5
  granny: room wall=#8a6a5a:stripes floor=#5a3a2a:wood light=warm | armchair .35 c=#6a3a3a | lamp .12 | mirror .75 s=.9 | picture .5 y=-60
  granny-ghost: room wall=#8a6a5a:stripes floor=#5a3a2a:wood light=dark | armchair .35 c=#6a3a3a | mirror .75 s=.9
  lake: outside sky=night moon=.7 far=pines ground=grass weather=fog | deadtree .2 s=.9 | pine .88 s=1.2
  street: outside sky=night far=pines ground=asphalt | house .5 s=.6 y=-60 c=#a89aa8 | streetlamp .15 | streetlamp .85
  mirrorworld: room wall=#4a5262:tile floor=#2a2e36:check light=red weather=dust | mirror .2 s=.9 | mirror .5 s=1.1 | mirror .8 s=.9
  maze: room wall=#20232a:plain floor=#14161a:check light=dark | mirror .15 s=1.1 | mirror .5 s=1.1 | mirror .85 s=1.1
  void: void

== 1
bathroom | Say her name three times in a mirror at midnight... and she'll show you ^how you die.^ | cam=push @maya:.5:scared:back+y=150+size=1.1
bedroom | It was Maya's sixteenth birthday. Movie night at her place. Four of us. Me. Maya. Hana. Bree. | @maya:.25:grin:sit+y=60 @hana:.45:smile:sit+y=60 @bree:.65:smile:sit+y=60 @me:.85:smile:idle+y=60 cam=right
bedroom | Pizza. Horror movies. And at eleven fifty-five, Bree had an idea. | @bree:.5:smug:talk+y=80 cam=push
bedroom | bree> Okay. Bloody Mary. Who's brave enough? | close=bree @bree:.5:grin:talk
bedroom | Everybody laughed. Everybody said no. Except Maya. | close=maya @maya:.5:smug:idle cam=zoom
bedroom | maya> [laugh] It's my birthday. I'll do it. | close=maya @maya:.5:grin:talk
bathroom | We turned off the lights. One candle on the sink. Four of us squeezed into a tiny bathroom. | @hana:.2:scared:idle+y=120 @me:.42:scared:idle+y=120 @bree:.82:grin:idle+y=120 cam=creep tag=11:59_PM
bathroom | Maya stood in front of the mirror. | @maya:.5:smile:back+y=150+size=1.1 cam=push
bathroom | maya> Bloody Mary. | cam=zoom sfx=sub
bathroom | maya> Bloody Mary. | cam=zoom fx=flicker
bathroom | maya> [whispering] Bloody... ^Mary.^ | cam=zoom sfx=heartbeat
bathroom | Nothing happened. We all screamed anyway. Then we laughed until we cried. | t=flash cam=shake sfx=scream
bedroom | We went to bed at two. I was the last one awake. | @me:.48:sleep:lie+y=-205+size=.85 fx=dark cam=creep
bedroom-dark | Then I heard water running. In the bathroom. | sfx=gust cam=push fx=dark
bathroom | Maya was standing in front of the mirror. Alone. In the dark. | @maya:.5:blank:back+y=150+size=1.1 cam=push
bathroom | She was brushing her hair. Slowly. | cam=zoom
bathroom | But her reflection... wasn't. Her reflection was standing still. ^Smiling^ at me. | win=ghost cam=zoom sfx=stinger

== 2
bathroom | The next morning, Maya didn't remember getting up. | close=maya @maya:.5:worried:idle t=black cam=push
bathroom | Then she brushed her teeth. And her reflection was ^half a second^ late. | @maya:.5:shocked:back+y=150+size=1.1 cam=zoom sfx=sub
school | At school, every mirror she passed did the same. A little bit late. A little bit wrong. | @maya:.5:terrified:walk+to=.7+y=120 cam=right
school | maya> [scared] Caleb. Every mirror. Something's ^behind^ me in every single one. | close=maya @maya:.5:terrified:talk
school | And on day two, the bathroom mirror at school fogged up. By itself. | cam=push sfx=whisper
void | | prop=sign:3/DAYS hold=2.0 sfx=stinger
school | Three days. Written from the other side of the glass. | close=me @me:.5:terrified:idle cam=zoom
bedroom | We covered every mirror in Maya's house. Towels. Sheets. Tape. | @maya:.4:scared:carry+box+y=80 @me:.65:determined:idle+y=80 cam=right
bedroom | Day three. We sat with her all night. Nobody slept. | @maya:.3:scared:sit+y=60 @hana:.5:scared:sit+y=60 @me:.72:scared:sit+y=60 cam=creep tag=DAY_3
bedroom-dark | At midnight, Maya went to the bathroom. She left the door open. | fx=dark cam=push
bedroom-dark | Thirty seconds. One minute. | sfx=tick fx=dark
bedroom-dark | Then the sound of a towel ^falling^ to the floor. | sfx=sub fx=dark cam=zoom
bathroom-ghost | The bathroom was empty. The window was locked. The towel was on the floor. | cam=push win=ghost
bathroom-ghost | And in the mirror... Maya. Banging on the glass. Screaming with no sound. | win=ghost cam=zoom sfx=stinger

== 3
bathroom-ghost | Maya. Trapped on the other side of a mirror. | win=ghost t=black cam=push
bathroom-ghost | I punched it. Hana threw a hairdryer. The glass didn't even crack. | t=flash sfx=glass cam=shake @me:.4:angry:reach+y=80 @hana:.7:angry:reach+y=80
bathroom | And then she faded. Like breath on a window. | cam=pull
library | The next day, Hana took us to the school library. She doesn't believe in ghosts. She believes in ^research.^ | @hana:.5:determined:hold+letter+y=100 cam=push
library | hana> [calm] Every town has its own Mary. So who's ours? | close=hana @hana:.5:determined:talk
library | The yearbooks went back to 1950. We found her in the 1963 one. | prop=photo:MARY_ELLIS_-_CLASS_OF_1963
library | Mary Ellis. Fifteen. Drowned in Silver Lake on her birthday. | prop=news:GIRL_DROWNS_IN_SILVER_LAKE:THE_VALLEY_PRESS:Mary_Ellis,_15 cam=zoom
library | The article said her sister was there. Her ^twin^ sister. | cam=push
library | Ruth Ellis. | close=me @me:.5:shocked:idle sfx=sub
library | Ruth Ellis married a man named Thomas Bennett in 1971. | prop=book:THE_ELLIS_FAMILY:Ruth:Mary_Ellis_-_1948-1963/Ruth_Ellis_-_born_1948/married_Thomas_Bennett_1971
library | Bennett. That's ^my^ last name. | close=me @me:.5:terrified:idle cam=zoom
library | Ruth Ellis... is my grandma. | close=me @me:.5:terrified:cover cam=shake sfx=stinger

== 4
granny | I drove to Grandma's house that night. She was knitting. Like always. | @gran:.35:smile:sit+y=40 t=black cam=push
granny | I put the yearbook on her lap. | @gran:.35:shocked:sit+y=40 @me:.68:determined:idle+y=60 cam=creep
granny | gran> [quiet] Where did you get this? | close=gran @gran:.5:terrified:talk
granny | I told her about the party. About Maya. About the mirror. | close=me @me:.5:crying:talk
granny | She took off her glasses. Her hands were shaking. | close=gran @gran:.5:sad:idle cam=push
granny | gran> [quiet] We were twins. Everybody loved Mary. Mary was the pretty one. The funny one. | close=gran @gran:.5:sad:talk
granny | gran> On our fifteenth birthday... I dared her to swim to the island in Silver Lake. In ^October.^ | close=gran @gran:.5:crying:talk cam=zoom
lake | gran> She didn't make it back. And I didn't call for help. Not for ten minutes. | tag=1963 fx=fog cam=push
lake | gran> [crying] Ten minutes, Caleb. Because for ten minutes... I wanted to be the only one. | close=gran @gran:.5:crying:talk fx=fog
granny | The room went cold. | fx=dark cam=creep
granny | And in the mirror behind Grandma... someone was standing. | win=ghost cam=zoom sfx=sub
granny-ghost | A girl. Fifteen. Black hair. White dress. With my grandmother's ^face.^ | win=ghost cam=zoom sfx=stinger

== 5
granny-ghost | Mary. Grandma's twin. Sixty-two years in a mirror. | win=ghost t=black cam=push
granny-ghost | Grandma didn't turn around. She didn't have to. She'd always known. | close=gran @gran:.5:terrified:idle fx=dark
granny-ghost | gran> [whispering] Don't look at her, Caleb. Look at me. | close=gran @gran:.5:terrified:talk fx=dark
granny-ghost | gran> [whispering] She can only pull you through... if you're looking ^into^ the glass. | close=gran rule=RULE_#1 @gran:.5:determined:talk fx=dark
granny-ghost | The mirror cracked. Right down the middle. And Mary was gone. | t=flash sfx=glass cam=shake
bedroom | Rule one. Never look into a mirror. | rule=RULE_#1 cam=push @me:.5:worried:idle+y=60
bedroom | That's harder than it sounds. Windows. Spoons. Car doors. Puddles. | cam=right
bedroom | Bree laughed at us. She thought we were doing a bit. | @bree:.5:grin:phone+item=phone+y=100 cam=push
bedroom | bree> [laugh] Ooh, scary. Let me just take a selfie with the ghost. | close=bree @bree:.5:grin:talk
bedroom | She held up her phone. Front camera. | prop=phone:camera:SELFIE_MODE sfx=click
bedroom | Her screen was black. Glossy. Like a ^mirror.^ | close=me @me:.5:terrified:idle cam=zoom
bedroom | And in it, behind her own face... another face. With black eyes. Getting closer. | cam=zoom sfx=stinger
bedroom | bree> [scared] Guys? Why is my phone so ^cold?^ | close=bree @bree:.5:terrified:talk cam=zoom

== 6
bedroom | Bree's phone fell to the floor. And Bree... wasn't there anymore. | t=flash sfx=glass cam=shake
bedroom | Just the phone. Screen down. Ice cold. | cam=push
bedroom | Two friends gone. Hana and me left. Two days until Maya's ^three days^ became forever. | close=hana @hana:.5:crying:idle cam=zoom
library | Hana stayed up all night with Grandma's old diary. | @hana:.5:determined:write+y=100 cam=creep tag=4:00_AM
library | hana> [calm] Your grandma wrote something in 1964. Listen. | close=hana @hana:.5:determined:talk
void | | prop=note:She_doesn't_want_to_hurt_them./She_wants_ME./She_wants_me_to_say_it. hold=2.8 sfx=page
library | Say what? | close=me @me:.5:suspicious:idle
library | hana> I think she wants the one thing your grandma never said. | close=hana @hana:.5:sad:talk cam=push
library | ^Sorry.^ | close=hana @hana:.5:sad:idle cam=zoom
street | So we drove to Grandma's again. At midnight. With a candle. | cam=push tag=11:58_PM
granny-ghost | Grandma's house was dark. The front door was open. | cam=creep fx=dark
granny-ghost | And every mirror in the house was ^uncovered.^ | cam=zoom sfx=sub
granny-ghost | Grandma was sitting in front of the big one. Looking straight into it. | @gran:.6:blank:back+y=60+size=1.1 fx=dark cam=push
granny-ghost | gran> [calm] Hello, Mary. | close=gran @gran:.5:blank:talk cam=zoom sfx=stinger

== 7
granny-ghost | Grandma stood up. She put her hand on the glass. | @gran:.6:sad:reach+y=60+size=1.1 t=black fx=dark cam=push
granny-ghost | gran> [crying] Let them go. Take me. It was always supposed to be me. | close=gran @gran:.5:crying:talk fx=dark
granny-ghost | And her hand went ^into^ the glass. Like water. | win=ghost cam=zoom sfx=gust
granny-ghost | I grabbed her other arm. Hana grabbed me. | @me:.4:terrified:reach+y=80 @hana:.2:terrified:reach+y=80 fx=dark cam=shake
granny-ghost | And all three of us fell through. | t=flash cam=shake sfx=glass
mirrorworld | Everything was the same. And everything was ^backwards.^ | fx=red cam=push
mirrorworld | The clock ran the other way. The letters on the walls were reversed. Our footsteps made no sound. | cam=right
mirrorworld | And every mirror on the other side... was a window back into our town. | cam=zoom
mirrorworld | In one of them, my mum was making breakfast. She looked right through me. | close=me @me:.5:crying:idle
maze | Then we found Maya. And Bree. Sitting on the floor. Holding hands. Alive. | @maya:.35:crying:sit+y=80 @bree:.6:crying:sit+y=80 cam=push
maze | maya> [crying] Caleb! You came! She said nobody would come! | close=maya @maya:.5:crying:talk
maze | But I wasn't looking at Maya. | close=me @me:.5:terrified:idle cam=zoom
maze | I was looking at the girl standing behind her. | cam=push
maze | Black hair. White dress. Fifteen years old. Forever. | !ghost:.5:idle+size=1.05 cam=zoom sfx=stinger

== 8
maze | Mary. Up close, she didn't look like a monster. She looked like a sad kid. | close=creature !ghost:.5:idle t=black cam=push
maze | mary> [whispering] Hello, Ruth. | close=creature !ghost:.5:idle sfx=whisper
maze | Grandma was crying so hard she couldn't speak. | close=gran @gran:.5:crying:idle
maze | gran> [crying] Mary. I'm sorry. I'm so sorry. I've been sorry every day for sixty-two years. | close=gran @gran:.5:crying:talk
maze | Mary tilted her head. | close=creature !ghost:.5:idle cam=zoom
maze | mary> [whispering] Then stay. Stay here with me. And they can ^go home.^ | close=creature !ghost:.5:reach cam=push
maze | Grandma looked at me. She was going to say yes. I could see it. | close=gran @gran:.5:sad:idle
maze | So I stepped in front of her. | @me:.5:determined:hands-up+y=100+size=1.1 cam=push
maze | I said: She's my grandma. She tells terrible jokes. She knits ugly sweaters. And I love her. | close=me @me:.5:crying:talk
maze | You can't have her. | close=me @me:.5:determined:talk cam=zoom
maze | Mary looked at me for a long time. | close=creature !ghost:.5:idle
maze | mary> [whispering] Then I'll take ^you.^ | close=creature !ghost:.5:reach cam=zoom sfx=stinger
maze | And she touched my face. | t=flash cam=shake fx=flicker

== 9
bathroom | When I opened my eyes, I was home. In my bathroom. Morning light. | @me:.5:shocked:back+y=150+size=1.1 t=black cam=push
bathroom | Maya called. Bree called. They were home too. They didn't remember anything. | prop=phone:chat:Maya:wtf_why_am_i_in_my_bed/did_we_go_out_last_night? sfx=buzz
bathroom | Grandma was home. Knitting. Like nothing happened. | close=gran @gran:.5:smile:idle
bathroom | Everything was perfect. | close=me @me:.5:smile:idle cam=zoom
school | Except Hana kept staring at me. All day. At lunch. In class. | @hana:.3:suspicious:idle+y=120 @me:.72:smile:idle+y=120 cam=push
school | hana> [quiet] Caleb. Since when do you write with your ^left^ hand? | close=hana @hana:.5:suspicious:talk
school | I looked down. I was holding my pen in my left hand. I've been right-handed my whole life. | close=me @me:.5:shocked:hold cam=zoom
school | My hair was parted on the wrong side. My freckle was on the wrong cheek. | close=me @me:.5:terrified:idle
school | Everything about me was ^backwards.^ | close=meX @meX:.5:smile:idle cam=zoom sfx=sub
school | Hana took a step back. | close=hana @hana:.5:terrified:idle
school | hana> [whispering] You're not Caleb. Are you? | close=hana @hana:.5:terrified:talk cam=push
school | And somewhere, in a mirror in the boys' bathroom down the hall... someone was banging on the glass. | sfx=knock cam=zoom
school | Someone with my face. | close=me @me:.5:terrified:talk win=ghost cam=zoom sfx=stinger

== 10
school | I'm the one in the mirror. I've been the one in the mirror since Mary touched my face. | close=me @me:.5:crying:talk t=black fx=red cam=push
school | Mary is out there. Wearing me. Going to my school. Hugging my mum. | close=meX @meX:.5:smile:idle
mirrorworld | I watched Mary wear my face. Through every mirror in town. For a week. | fx=red cam=right
mirrorworld | And then I watched Hana walk into Grandma's house. And tell her everything. | cam=push
granny | Grandma knew what to do. She'd known for sixty-two years. | @gran:.5:determined:idle+y=60 cam=creep
granny | She sat Mary down in front of the big mirror. And held her hand. | @gran:.4:sad:sit+y=60 @meX:.65:blank:sit+y=60 cam=push
granny | gran> [quiet] Mary. You don't want his life. You want ^yours.^ The one I took. | close=gran @gran:.5:crying:talk
granny | gran> I can't give it back. But I can give you this. | close=gran @gran:.5:crying:talk
granny | And she told her everything. Sixty-two years of birthdays. Every one of them, she'd set two plates. | close=gran @gran:.5:sad:talk cam=zoom
granny | Mary started crying. Then she started laughing. Then both. | close=meX @meX:.5:crying:idle
granny | mary> [crying] You kept my plate? | close=meX @meX:.5:crying:talk
granny | gran> [crying] Every single year. | close=gran @gran:.5:crying:talk cam=push
granny | The mirror went bright. Like sunlight. And I fell out of it onto the carpet. | t=flash cam=shake sfx=glass
granny | And Mary was gone. Really gone. Not in the mirror. Not anywhere. | cam=pull
granny | Grandma says she finally went where she was supposed to go. | @gran:.4:smile:hug+y=60 @me:.62:crying:hug+y=60 cam=creep
bathroom | I'm right-handed again. Everything's normal. | @me:.5:smile:back+y=150+size=1.1 cam=push tag=ONE_MONTH_LATER
bathroom | But last night, Grandma called me. At midnight. Whispering. | prop=phone:call:Grandma:00:00 sfx=buzz
bathroom | gran> [whispering] Caleb. There were ^three^ of us. Mary and I had a little brother. | prop=phone:call:Grandma:00:01 cam=zoom
bathroom | gran> [whispering] He went missing in 1965. In front of a mirror. Saying ^her^ name. | close=me @me:.5:terrified:phone+item=phone cam=zoom sfx=stinger
