
import json
f = open('placesOutput.csv','r')

lines = f.readlines();

places = {}

for line in lines:
	try:
		chunks  = line.split(',')
		place   = chunks[0]
		lat		= float(chunks[1])
		lng     = float(chunks[2])
		places[place] = [lat,lng]
	except:
		print line
f.close()

f = open('places.js','w')
json.dump(places,f)

