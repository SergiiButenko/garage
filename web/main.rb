require 'sinatra'
require 'json'
require 'arduino'

set :bind, '0.0.0.0'

ports = `ls /dev`.split("\n").grep(/usb|ACM/i).map{|d| "/dev/#{d}"}
port = nil
ports.each do |p|
  puts "port #{p}"
  if p.include? 'tty'
    port = p
    puts "PASSED"
    break
  end
  puts "FAILED"
end

# exit 1 if p.nil?
Arduino.new(ports.first).close

board = Arduino.new(ports.first)
puts "#{board}"

get '/' do
  html :index
end	

board.output(7,8,9)

get '/on/:id' do
  puts "ON #{params['id']}!"
  board.setHigh(params['id'].to_i)
  sleep 2

  st = { :branches => [{:id => 1, :status => board.getState(1)}, {:id => 2, :status => board.getState(2)}, {:id => 3, :status => board.getState(3)}] }.to_json
  puts st
  
  content_type :json
  st
end	

get '/off/:id' do
  puts "OFF #{params['id']}!"
  board.setLow(params['id'].to_i)
  sleep 2

  st = { :branches => [{:id => 1, :status => board.getState(1)}, {:id => 2, :status => board.getState(2)}, {:id => 3, :status => board.getState(3)}] }.to_json
  puts st
  
  content_type :json
  st
end	

get '/status' do
  st = { :branches => [{:id => 1, :status => board.getState(1)}, {:id => 2, :status => board.getState(2)}, {:id => 3, :status => board.getState(3)}] }.to_json
  puts st
  
  content_type :json
  st
end

get '/temp' do 
  content_type :json
  { :temp => {:up => Arduino_extended.temp, :down => Arduino_extended.temp_baseline}}.to_json
end

def html(view)
  File.read(File.join('views', "#{view.to_s}.html"))
end
