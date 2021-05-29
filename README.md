# KMITLChallenge

url : http://kmitlchallenge-env.eba-anqypzmj.ap-southeast-1.elasticbeanstalk.com/

# post

- create new bus 
```
#POST
<url> + "/feed/bus" 

#data to send
{
    Bus_ID:<string>,
    lat:<float>,
    long:<float>
}
```

- create new station 
```
#POST
<url> + "/feed/station/<stationID>" 

#data to send
{
    station_ID:<string>,
    station_name:<string>,
    bus_pass:[array of <string>]
    lat:<float>,
    long:<float>
}
```

# get

- get all buses
```
<url> + "/feed/bus" 
```

- get all stations 
```
<url> + "/feed/stations" 
```

- get bus by ID
```
<url> + "/feed/station/<busID>" 
```

- get station by ID
```
<url> + "/feed/station/<stationID>" 
```