import freesound

from bs4 import BeautifulSoup
import datetime
from tinydb import TinyDB, Query
import urllib3
import xlsxwriter

from pydub import AudioSegment

import os

# create list of instaments

# freesound api token and client
client = freesound.FreesoundClient()
client.set_token("J4XiwSsuIaqGVTj8SHgXoA7lURZ6CgAw7aHchkoT","token")


# Beautiful soup url and set up
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

url = 'https://www.imit.org.uk/pages/a-to-z-of-musical-instrument.html'
total_added = 0

def make_soup(url):
    http = urllib3.PoolManager()
    r = http.request("GET", url)
    return BeautifulSoup(r.data,'lxml')


def convert_to_wav(file):
	sound = AudioSegment.from_mp3(src)
	sound.export(dst, format="wav")


def get_sounds(instament):
	# set to 5 so my computer can store everything and for testing
	# change the query to modify the scearch
	results = client.text_search(query= instament ,fields="id,name,previews")

	print("Num results:", results.count)
	while results != None:

		for sound in results:

			sound.retrieve_preview(".",sound.name)
			filename = sound.name.split('.')[0] + '.wav'
			print(filename)
			# #renaming them to avoid the double .wav.wav
			os.rename(str(home_path) + str('/instaments/') + str(instament) + str('/') + str(sound.name), str(home_path) + str('/instaments/') + str(instament) + str('/') + str(filename) )

		try:
			print("next page")
			results = results.next_page()
		except:
			print("no more pages")
			results = None

	#print("Done " + str(instament))
	curr = 0


def get_list():

	soup = make_soup(url)
	results = soup.find_all("td")
	count = 0
	skip_tag = "<td> </td>"
	instaments_list = []

	for i in results:

		count += 1
		if count <= 8:
			continue

		if str(i) == skip_tag:
			continue
		tmp = str(i)

		if len(tmp) > 3:
			tmp =  tmp.replace(tmp[:4], '')
	
			# chech for first char = < means its a link and can be skipped
			if tmp[0] == '<':
				continue

		# now only need to trim the last 4 off the end
		tmp = tmp.replace(tmp[-5:], '')
		#print(tmp)
		instaments_list.append(tmp)
		# for testing	
		#if count > 15:
			#break
	return instaments_list


def create_dir(list, home_path):

	# alows creation of new value
	mode = 0o777
	try:  
		os.mkdir(home_path + str('/instaments/'), mode) 
	except OSError as error:  
		print(error)  

	for i in list:
		# check for '(' find where in string they are 
		index = i.find('(')
		# remove the '(' and the char before it
		if index != -1:
			index = index - 1
			i = i.replace(i[index:], '')
		print(i)

		try:  
			os.mkdir(str(home_path) + str('/instaments/') + str(i), mode)
			os.chdir(str(home_path) + str('/instaments/') + str(i))
			
			# off for testing on the ferry
			get_sounds(i)
			os.chdir(str(home_path))
		except OSError as error:  
			print(error)  


# set to your own path
home_path = os.path.dirname(os.path.abspath(__file__))

#function calling
#in_list = get_list()
tmp_list = [ 'Kick', 'Kicks', 'KICK', 'Snare', 'Cymbal', 'Cymbals', 'Bass', 'Guitar', 'Guitars', 'Horns', 'Keys', 'Strings' ]
create_dir(tmp_list, home_path)




