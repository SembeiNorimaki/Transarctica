// Copyright (C) 2023  Sembei Norimaki

// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

class Navigation {
  constructor() {
    
  }

  update() {
    locomotive.update();
    //let aux = worldMap.map2screen(locomotive.position.x, locomotive.position.y, 2);
    //cameraPos.set(aux.x, aux.y)
    
    if (locomotive.enteredNewTile(2)) {   // check front sensor
      let tileString = String(locomotive.currentTileFrontSensor.x) + "," + String(locomotive.currentTileFrontSensor.y);
      
      if (tileString in events) {
        console.log("Event", events[tileString]);
        locomotive.inmediateStop();
        locomotive.turn180();
        if (events[tileString] == "Mine") {  // mine
          currentScene = "Mine";
          //hud.showMine();

        } else {
          currentCity = new ScnCityTrade(citiesData[events[tileString]], industryData, roadsData, buildingsData, backgroundImg);
          currentScene = "CityTrade";
        }
      } else {
        locomotive.checkFrontSensor();
      }

    } else if (locomotive.enteredNewTile(1)) {   // check central sensor
      locomotive.newOrientation();
    }
  }

  show() {
    worldMap.show(mainCanvas, cameraPos);
    locomotive.show(mainCanvas, cameraPos);
    //hud.show(hudCanvas);
  }
}