/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
 /**
 * MODIFIED by K Brown
 * University of York
 * 2016
 *
 * FOADecoder :
 * Removed use of media tag and context.destination,
 * Added input and output nodes so can use KXOmnitone as a general element 
 * in a Web Audio API node graph.
 */

'use strict';

// Primary namespace for Omnitone library.
exports.KXOmnitone = require('./kx-omnitone.js');
