// variable to store the data from the serial port
int cmd = 0;

// command arguments
int cmd_arg[2];

int serialStatus = 0;


byte button_A = 2;
byte button_B = 3;
byte button_C = 4;
byte button_D = 5;

byte relay_A = 7;
byte relay_B = 8;
byte relay_C = 9;

byte bassement_sensor = 11;
byte door_sensor = 12;

void setup() {
  pinMode(button_A, INPUT);
  pinMode(button_B, INPUT);
  pinMode(button_C, INPUT);
  pinMode(button_D, INPUT);

  pinMode(relay_A, OUTPUT);
  pinMode(relay_B, OUTPUT);
  pinMode(relay_C, OUTPUT);

  pinMode(bassement_sensor, INPUT);
  pinMode(door_sensor, INPUT);

  // connect to the serial port
  Serial.begin(115200);
  setupPins();
  serialStatus = 1;
}

void loop()
{
  if(serialStatus==0)
  {
    Serial.flush();
    setupPins();
  }
  askCmd();

  {
    if(Serial.available()>0)
    {
      cmd = int(Serial.read()) - 48;      
      if(cmd==0) //set digital low
      {
        cmd_arg[0] = int(readData()) - 48;
        digitalWrite(cmd_arg[0],LOW);
      }

      if(cmd==1) //set digital high
      {
        cmd_arg[0] = int(readData()) - 48;
        digitalWrite(cmd_arg[0],HIGH);
      }

      if(cmd==2) //get digital value
      {
        cmd_arg[0] = int(readData()) - 48;
        cmd_arg[0] = digitalRead(cmd_arg[0]);
        Serial.println(cmd_arg[0]);
      }

      if(cmd==3) // set analog value
      {
        Serial.println("I'm in the right place");
        cmd_arg[0] = int(readData()) - 48;
        cmd_arg[1] = readHexValue();
        analogWrite(cmd_arg[0],cmd_arg[1]);
      }

      if(cmd==4) //read analog value
      {
        cmd_arg[0] = int(readData()) - 48;
        cmd_arg[0] = analogRead(cmd_arg[0]);
        Serial.println(cmd_arg[0]);
      }

      if(cmd==5)
      {
        serialStatus = 0;
      }

    }
  }
}

char readData()
{
  askData();

  while(1)
  {
    if(Serial.available()>0)
    {
      return Serial.read();
    }
  }
}


//read hex value from serial and convert to integer
int readHexValue()
{
  int strval[2];
  int converted_str;

  while(1)
  {
    if(Serial.available()>0)
    {
      strval[0] = convert_hex_to_int(Serial.read());
      break;
    }
  }

  askData();

  while(1)
  {
    if(Serial.available()>0)
    {
      strval[1] = convert_hex_to_int(Serial.read());
      break;
    }
  }

  converted_str = (strval[0]*16) + strval[1];
  return converted_str;
}


int convert_hex_to_int(char c)
{
  return (c <= '9') ? c-'0' : c-'a'+10;
}


void askData()
{
  Serial.println("?");
}


void askCmd()
{
  askData();
  while(Serial.available()<=0)
  {

    if (digitalRead(button_A) == HIGH){
      digitalWrite(relay_A, HIGH);
    }

    if (digitalRead(button_B) == HIGH){
      digitalWrite(relay_B, HIGH);
    }

    if (digitalRead(button_C) == HIGH){
      digitalWrite(relay_A, HIGH);
      digitalWrite(relay_C, HIGH);
    }

    if (digitalRead(button_D) == HIGH){
      digitalWrite(relay_A, LOW);
      digitalWrite(relay_C, LOW);
      delay(60*1000);
    }


    if(digitalRead(bassement_sensor) == LOW){
      digitalWrite(relay_B, HIGH);      
    }
    else{
      digitalWrite(relay_B, LOW);
    } 

    if(digitalRead(door_sensor) == LOW){
      digitalWrite(relay_A, HIGH);      
    }

  }
}


void setupPins()
{
  while(Serial.available()<1)
  {
    // get number of output pins and convert to int
    cmd = int(readData()) - 48;
    for(int i=0; i<cmd; i++)
    {
      cmd_arg[0] = int(readData()) - 48;
      pinMode(cmd_arg[0], OUTPUT);
    }
    break;
  }
}

















