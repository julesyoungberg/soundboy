import freesound

from bs4 import BeautifulSoup
import datetime
from tinydb import TinyDB, Query
import urllib3
import xlsxwriter

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


def get_sounds(instament):
	# set to 5 so my computer can store everything and for testing
	count = 5
	curr = 0
	# change the query to modify the scearch
	results = client.text_search(query= instament,fields="id,name,previews")

	for sound in results:
		if curr == count:
			break

		sound.retrieve_preview(".",sound.name+".mp3")
		print(sound.name)
		curr += 1 

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
		os.mkdir(home_path, mode) 
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
			os.mkdir("/Users/jonathankelly/Desktop/csc_475/project/instaments/" + str(i), mode)
			os.chdir("/Users/jonathankelly/Desktop/csc_475/project/instaments/" + str(i))
			
			# off for testing on the ferry
			get_sounds(i)
			os.chdir("/Users/jonathankelly/Desktop/csc_475/project/instaments/")
		except OSError as error:  
			print(error)  



home_path = "/Users/jonathankelly/Desktop/csc_475/project/instaments"

#function calling
in_list = get_list()
create_dir(in_list, home_path)




