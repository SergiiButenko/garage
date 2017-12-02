require 'sinatra'
require 'json'
require "arduino"

ports = `ls /dev`.split("\n").grep(/usb|ACM/i).map{|d| "/dev/#{d}"}
puts "port: #{ports}"

port = nil
ports.each do |p|
  if p.include? 'tty'
    port = p
    break
end

exit 1 if p.nil?

board = Arduino.new(port)
puts "#{board}"

get '/' do
  html :index
end	

board.output(7,8,9)

get '/on/:id' do
  puts "ON #{params['id']}!"
  board.setHigh(params['id'].to_i)
  
  st = board.getState(params['id'])
  puts "#{st.to_s}"

  content_type :json
  { :branches => [{:id => 1, :status => board.getState(1)}, {:id => 2, :status => board.getState(2)}, {:id => 3, :status => board.getState(3)}] }.to_json
end	

get '/off/:id' do
  puts "OFF #{params['id']}!"
  board.setLow(params['id'].to_i)
  
  st = board.getState(params['id'])
  puts "#{st.to_s}"

  content_type :json
  { :branches => [{:id => 1, :status => board.getState(1)}, {:id => 2, :status => board.getState(2)}, {:id => 3, :status => board.getState(3)}] }.to_json
end	

get '/status' do
  content_type :json
  { :branches => [{:id => 1, :status => board.getState(1)}, {:id => 2, :status => board.getState(2)}, {:id => 3, :status => board.getState(3)}] }.to_json
end

get '/temp' do 
  content_type :json
  { :temp => {:up => Arduino_extended.temp, :down => Arduino_extended.temp_baseline}}.to_json
end

def html(view)
  File.read(File.join('views', "#{view.to_s}.html"))
end
