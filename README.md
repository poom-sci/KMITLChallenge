# KMITLChallenge

url : http://kmitlchallenge-env.eba-anqypzmj.ap-southeast-1.elasticbeanstalk.com/

# Post

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

# Get

- get all buses
```
#GET
<url> + "/feed/bus" 
```

- get all stations 
```
#GET
<url> + "/feed/stations" 
```

- get bus by ID
```
#GET
<url> + "/feed/station/<busID>" 
```

- get station by ID
```
#GET
<url> + "/feed/station/<stationID>" 
```